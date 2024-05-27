import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Artist } from '../../Service/artist/Artists';
import { DataService } from '../../Service/data/data.service';
import { MusicService } from '../../Service/music/music.service';
import { TrackDetail } from '../../Service/music/track-detail.i';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss',
})
export class ArtistComponent implements OnInit {
  token: string = '';
  getArtistSubscription!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private music: MusicService,
    private musicService: MusicService,
    private artistService: DataService,
  ) {}
  listItems!: TrackDetail[];
  artist!: Artist;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.getArtist(id);
      this.getAlbum(id);
    });
  }

  updateData(currentTrack: TrackDetail) {
    const dataTrackCurrent = JSON.stringify(currentTrack);
    localStorage.setItem('trackCurrent', dataTrackCurrent);
    this.musicService.updateData();
    this.musicService.playSubject.next(true);
  }

  getAlbum(id: string) {
    this.artistService.getTrackArtist(id).subscribe((data) => {
      this.listItems = data.tracks;
    });
  }

  format(milliseconds: number) {
    return this.artistService.formatMillisecondsToMinutesAndSeconds(
      milliseconds,
    );
  }

  getArtist(id: string) {
    this.getArtistSubscription = this.artistService
      .getArtist(id)
      .subscribe((data: Artist) => {
        this.artist = data;
      });
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
}
