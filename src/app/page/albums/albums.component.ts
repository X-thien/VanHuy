import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Item, Track } from '../../Service/music/track';
import { Subscription } from 'rxjs';
import { AlbumDetail } from '../../Service/album/album-detail.i';
import { DataService } from '../../Service/data/data.service';
import { MusicService } from '../../Service/music/music.service';
import { TrackDetail } from '../../Service/music/track-detail.i';
import { Device } from '../../Service/music/device.i';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsComponent implements OnInit, OnDestroy {
  track!: Track;
  album!: AlbumDetail;
  link: string;
  getAlbumSub!: Subscription;
  getTrackAlbumSub!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    private dataService: DataService,
  ) {
    this.link = '';
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.getAlbum(id);
      this.getTrackAlbum(id);
    });
  }
  format(milliseconds: number): string {
    return this.dataService.formatMillisecondsToMinutesAndSeconds(milliseconds);
  }
  updateData(currentTrack: Item) {
    const dataTrackCurrent = JSON.stringify(currentTrack);
    localStorage.setItem('trackCurrent', dataTrackCurrent);
    this.musicService.updateData();
    this.musicService.playSubject.next(true);
  }

  getTrackAlbum(id: string) {
    this.getAlbumSub = this.getTrackAlbumSub = this.dataService
      .getTrackAlbum(id)
      .subscribe((data: Track) => {
        this.track = data;
      });
  }
  getAlbum(id: string) {
    if (id) {
      this.dataService.getAlbumDetail(id).subscribe((data: AlbumDetail) => {
        this.album = data;
      });
    }
  }
  getTrackPlay(id: string) {
    this.link = id;
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
  ngOnDestroy(): void {
    this.getTrackAlbumSub.unsubscribe();
    this.getAlbumSub.unsubscribe();
  }
}
