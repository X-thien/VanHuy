import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EditInfoPlaylistComponent } from '../../Components/edit-info-playlist/edit-info-playlist.component';
import { DataService } from '../../Service/data/data.service';
import { Device } from '../../Service/music/device.i';
import { MusicService } from '../../Service/music/music.service';
import { Item } from '../../Service/music/track';
import { TrackDetail } from '../../Service/music/track-detail.i';
import {
  ItemPlaylist,
  PlaylistInfo,
} from '../../Service/playlist/playlist-detail.i';
import { PlaylistService } from '../../Service/playlist/playlist.service';
import { SearchService } from '../../Service/search/search.service';
import { Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-my-playlist',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, EditInfoPlaylistComponent],
  templateUrl: './my-playlist.component.html',
  styleUrl: './my-playlist.component.scss',
})
export class MyPlaylistComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal!: EditInfoPlaylistComponent;
  showModal: boolean = false;
  imgUrl = '';
  infoPlaylist!: PlaylistInfo;
  infoPlaylistSubscription!: Subscription;
  getPictureSubscription!: Subscription;
  dataSubscription!: Subscription;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private dataService: DataService,
    private searchService: SearchService,
    private musicService: MusicService,
  ) {}
  dataTrack!: TrackDetail[];
  searchValue: string = '';
  data!: ItemPlaylist[];
  idPlaylist: string = '';
  ngOnInit(): void {
    localStorage.removeItem('dataSavePlaylist');
    this.route.paramMap.subscribe((params) => {
      const code = params.get('id');
      if (code) {
        this.idPlaylist = code;
        this.playlistService.getPlaylist(code).subscribe((playlists) => {
          this.playlistService.updateData(playlists);
          // this.data = playlists.items;
          this.getPicture(code);
          this.getInfoPlaylist(code);
          this.searchService
            .getInput()
            .pipe(
              debounceTime(1000),
              switchMap((input: string) => {
                if (input) return this.searchService.searchRS(input, 'track');
                else return [];
              }),
            )
            .subscribe((data) => {
              this.dataTrack = data.tracks.items;
            });
        });
      }
    });
  }

  updateInfoPlaylist(namePlaylist: string) {
    if (namePlaylist) {
      this.infoPlaylist.name = namePlaylist;
    }
    this.getPicture(this.idPlaylist);
    this.playlistService.getMyPlaylist().subscribe((data) => {
      for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].id === this.idPlaylist && namePlaylist) {
          data.items[i].name = namePlaylist;
          localStorage.setItem(
            'dataSavePlaylist',
            JSON.stringify(data.items[i]),
          );
          break;
        }
      }
      this.playlistService.updateMyPlaylist(data);
    });
  }

  Format(milliseconds: number): string {
    return this.dataService.formatMillisecondsToMinutesAndSeconds(milliseconds);
  }

  getInfoPlaylist(id: string) {
    this.infoPlaylistSubscription = this.playlistService
      .getInfoPlaylist(id)
      .subscribe((data) => {
        this.dataSubscription = this.playlistService.data$.subscribe((data) => {
          if (data) this.data = data.items;
        });
        const dataSavePlaylist = localStorage.getItem('dataSavePlaylist');
        if (dataSavePlaylist) {
          const dataPlaylist = JSON.parse(dataSavePlaylist!);
          if (id === dataPlaylist.id) {
            this.infoPlaylist = dataPlaylist;
          } else {
            this.infoPlaylist = data;
          }
        } else {
          this.infoPlaylist = data;
        }
      });
  }

  getPicture(id: string) {
    this.getPictureSubscription = this.playlistService
      .getPicture(id)
      .subscribe((dataImg) => {
        if (dataImg.length) {
          this.imgUrl = dataImg[0].url;
        } else {
          this.imgUrl = '';
        }
      });
  }

  openModal() {
    if (this.modal) this.modal.openModal();
  }

  onInputChange() {
    this.searchService.setInputValue(this.searchValue);
  }

  addTrackToPlaylist(uri: string) {
    this.route.paramMap.subscribe((params) => {
      const code = params.get('id');
      if (code) {
        this.playlistService.addTrackToPlaylist(code, uri).subscribe(() => {
          this.playlistService.getPlaylist(code).subscribe((data) => {
            this.playlistService.updateData(data);
          });
          this.playlistService.data$.subscribe((data) => {
            if (data) this.data = data.items;
          });
        });
      }
    });
  }

  removeTrack(uri: string) {
    this.route.paramMap.subscribe((params) => {
      const code = params.get('id');
      if (code) {
        this.playlistService
          .removeTrackFromPlaylist(code, uri)
          .subscribe(() => {
            this.playlistService.getPlaylist(code).subscribe((data) => {
              this.playlistService.updateData(data);
            });
            this.playlistService.data$.subscribe((data) => {
              if (data) this.data = data.items;
            });
          });
      }
    });
  }
  updateData(currentTrack: Item) {
    const dataTrackCurrent = JSON.stringify(currentTrack);
    localStorage.setItem('trackCurrent', dataTrackCurrent);
    this.musicService.updateData();
    this.musicService.playSubject.next(true);
  }

  playTrack(id: string, uri: string, i: number) {
    localStorage.setItem('currentPlay', 'true');
    this.musicService.getTrack(id).subscribe((data: TrackDetail) => {
      const dataString = JSON.stringify(data);
      localStorage.setItem('trackCurrent', dataString);
    });
    this.musicService.getDevice().subscribe((data: Device) => {
      this.musicService
        .playList(uri, 0, data.devices[0].id, i)
        .subscribe(() => {});
    });
  }

  openEdit() {
    this.showModal = true;
  }

  ngOnDestroy(): void {
    this.infoPlaylistSubscription.unsubscribe();
    this.getPictureSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }
}
