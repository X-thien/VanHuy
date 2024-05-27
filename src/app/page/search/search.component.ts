import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription, debounceTime, switchMap } from 'rxjs';
import { AlbumDetail } from '../../Service/album/album-detail.i';
import { Artist } from '../../Service/artist/Artists';
import { TopTrack } from '../../Service/data/top-track.i';
import { TrackDetail } from '../../Service/music/track-detail.i';
import { PlaylistInfo } from '../../Service/playlist/playlist-detail.i';
import { Playlist } from '../../Service/playlist/playlist.i';
import { Search } from '../../Service/search/search.i';
import { SearchService } from '../../Service/search/search.service';
import { MusicService } from '../../Service/music/music.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  data!: Playlist;
  searchValue = '';
  dataArtist = new Artist();
  listItems!: TrackDetail[];
  dataTrack: TrackDetail[] = [];
  dataAlbum: AlbumDetail[] = [];
  dataPlaylist: PlaylistInfo[] = [];
  dataArtists: Artist[] = [];
  dataArtistSubscription!: Subscription;
  dataAlbumSubscription!: Subscription;
  dataTrackSubscription!: Subscription;
  dataFeatureSubscription!: Subscription;
  searchSubscription!: Subscription;
  constructor(
    private http: HttpClient,
    private searchService: SearchService,
    private router: Router,
    private musicService: MusicService,
  ) {}
  ngOnInit(): void {
    this.searchService.setSearchBehaviorSubject(true);
    this.searchService
      .getInput()
      .pipe(
        debounceTime(1000),
        switchMap((input: string) => {
          if (input) {
            this.searchValue = input;
            return this.searchService.searchRS(input, 'artist');
          } else {
            this.searchValue = '';
            return this.searchService.getFeature();
          }
        }),
      )
      .subscribe((data) => {
        if (this.searchValue) {
          if ('artists' in data) {
            this.dataArtist = data.artists.items[0];
          }
          this.searchService
            .searchRS(this.searchValue, 'playlist')
            .subscribe((data: Search) => {
              if (data) {
                const playlistRandom = data.playlists.items.sort(
                  () => Math.random() - 0.5,
                );
                this.dataPlaylist = playlistRandom.slice(0, 7);
              }
            });
          this.searchService
            .searchRS(this.searchValue, 'artist')
            .subscribe((dataA: Search) => {
              if (data) {
                const artistRandom = dataA.artists.items.sort(
                  () => Math.random() - 0.5,
                );
                this.dataArtists = artistRandom.slice(0, 7);
              }
            });
          this.dataTrackSubscription = this.searchService
            .getTrackRS(this.dataArtist.id)
            .subscribe((dataTrack: TopTrack) => {
              this.listItems = dataTrack.tracks;
              const albumRandom = dataTrack.tracks.sort(
                () => Math.random() - 0.5,
              );

              this.dataTrack = albumRandom.slice(0, 4);
              this.dataAlbumSubscription = this.searchService
                .searchRS(this.searchValue, 'album')
                .subscribe((dataAlbum: Search) => {
                  const albumRandom = dataAlbum.albums.items.sort(
                    () => Math.random() - 0.5,
                  );
                  this.dataAlbum = albumRandom.slice(0, 7);
                });
            });
        } else {
          if ('message' in data) {
            this.data = data;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.searchService.setSearchBehaviorSubject(false);
    if (this.dataAlbumSubscription) {
      this.dataAlbumSubscription.unsubscribe();
    }
    if (this.dataArtistSubscription) {
      this.dataArtistSubscription.unsubscribe();
    }
    if (this.dataTrackSubscription) {
      this.dataTrackSubscription.unsubscribe();
    }
    if (this.dataFeatureSubscription) {
      this.dataFeatureSubscription.unsubscribe();
    }
  }

  playTrack(id: string, uri: string, i: number) {
    localStorage.setItem('currentPlay', 'true');

    this.musicService.getTrack(id).subscribe((data: TrackDetail) => {
      const dataString = JSON.stringify(data);
      localStorage.setItem('trackCurrent', dataString);
    });
    const uris = this.listItems.map((track) => track.uri);
    this.musicService.getDevice().subscribe((data) => {
      this.musicService
        .playTrackA(uris, i, data.devices[0].id)
        .subscribe(() => {});
    });
  }
  updateData(currentTrack: TrackDetail) {
    const dataTrackCurrent = JSON.stringify(currentTrack);
    localStorage.setItem('trackCurrent', dataTrackCurrent);
    this.musicService.updateData();
    this.musicService.playSubject.next(true);
  }
}
