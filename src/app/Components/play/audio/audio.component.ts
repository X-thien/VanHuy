import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from 'ngx-slider-v2';
import { Subscription, delay, interval, switchMap, takeWhile } from 'rxjs';
import { DataService } from '../../../Service/data/data.service';
import { Device } from '../../../Service/music/device.i';
import { MusicService } from '../../../Service/music/music.service';
import { Item } from '../../../Service/music/track';
import { TrackDetail } from '../../../Service/music/track-detail.i';
import { SpotifyService } from '../../../Service/spotify/spotify.service';

@Component({
  selector: 'app-audio',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxSliderModule],
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.scss',
})
export class AudioComponent implements OnInit, OnDestroy {
  dataTrack!: TrackDetail;
  getTrackSub!: Subscription;
  device!: Device;
  private dataSubscription!: Subscription;
  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private musicService: MusicService,
    private spotifyService: SpotifyService,
  ) {}

  progressPercent: number = 0;
  progressTime!: number;
  playTrue: boolean = true;
  play!: boolean;
  getCurrentTrackSub!: Subscription;
  intervalSub!: Subscription;
  numberC: number = 0;
  deviceId!: string;
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.spotifyService.createWebPlayer(localStorage.getItem('token')!);
      this.musicService.getData().subscribe((dataS) => {
        if (dataS) {
          this.getTrackSub = this.musicService
            .getTrack(dataS.id)
            .subscribe((trackInfo: TrackDetail) => {
              this.dataTrack = trackInfo;
            });
        }
      });

      if (localStorage.getItem('currentPlay') === 'true') {
        // this.musicService.pauseTrack().subscribe();
        localStorage.setItem('currentPlay', 'false');
      }
      setInterval(() => {
        this.progressTime = Number(localStorage.getItem('test'));
      }, 1000);

      this.musicService.playSubject.subscribe((data: boolean) => {
        this.play = data;
      });
      this.playMusic();
    }
  }

  format(duration_ms: number) {
    return this.dataService.formatMillisecondsToMinutesAndSeconds(duration_ms);
  }

  ngOnDestroy(): void {
    this.getTrackSub.unsubscribe();
    this.getCurrentTrackSub.unsubscribe();
  }

  handleClick() {
    if (!this.play) {
      this.musicService.playSubject.next(true);
      this.musicService.getDevice().subscribe((data) => {
        this.device = data;
        this.musicService
          .playTrack(
            this.dataTrack.uri,
            this.progressTime,
            this.device.devices[0].id,
          )
          .subscribe(() => {});
      });
      this.playMusic();
      localStorage.setItem('currentPlay', 'true');
    } else {
      this.musicService.pauseTrack().subscribe(() => {});
      localStorage.setItem('currentPlay', 'false');
    }
    this.play = !this.play;
  }

  updateCurrent(currentTrack: Item) {
    const dataTrackCurrent = JSON.stringify(currentTrack);
    localStorage.setItem('trackCurrent', dataTrackCurrent);
    this.musicService.updateData();
  }
  playMusic() {
    this.musicService.getCurrentPlaying().subscribe((dataC) => {
      if (dataC && dataC.item) {
        this.updateCurrent(dataC.item);
      }
      this.musicService.getData().subscribe((dataS) => {
        if (dataS) {
          this.getTrackSub = this.musicService
            .getTrack(dataS.id)
            .subscribe((trackInfo: TrackDetail) => {
              this.dataTrack = trackInfo;
            });
        }

        if (dataC && dataC.item && dataC.item.name === dataS?.name) {
          if (dataC.progress_ms > 1000) {
            this.numberC = dataC.progress_ms;
            dataC.progress_ms = 0;
          }
        } else {
          this.numberC = 0;
        }
        if (dataS) {
          this.dataTrack = dataS;
          this.musicService.playSubject.subscribe((data: boolean) => {
            this.play = data;
            if (this.play) {
              if (this.intervalSub) {
                this.intervalSub.unsubscribe();
              }
              this.intervalSub = interval(1000)
                .pipe(
                  takeWhile(
                    () => this.play && this.numberC < dataS.duration_ms,
                  ),
                )
                .subscribe(() => {
                  this.numberC += 1000;
                  // if (dataC && dataC.item && dataC.item.duration_ms != null) {
                  this.progressPercent = Math.floor(
                    (this.numberC / dataS.duration_ms) * 100,
                  );
                  this.progressTime = this.numberC;
                  localStorage.setItem('test', String(this.progressTime));
                  // }
                  if (this.numberC >= dataS.duration_ms) {
                    this.playMusic();
                  }
                });
            }
          });
        }
      });
      // }
    });
  }
  handleClickNext() {
    localStorage.setItem('currentPlay', 'true');
    this.musicService.playSubject.next(true);
    this.musicService.getDevice().subscribe((device) => {
      this.musicService
        .nextMusic(device.devices[0].id)
        .pipe(
          delay(1000),
          switchMap(() => this.musicService.getCurrentPlaying()),
        )
        .subscribe((data) => {
          this.updateCurrent(data.item);
          this.numberC = 0;
        });
    });
  }
  handleClickPre() {
    localStorage.setItem('currentPlay', 'true');
    this.musicService.playSubject.next(true);
    this.musicService.getDevice().subscribe((device) => {
      this.musicService
        .preMusic(device.devices[0].id)
        .pipe(
          delay(1000),
          switchMap(() => this.musicService.getCurrentPlaying()),
        )
        .subscribe((data) => {
          this.updateCurrent(data.item);
          this.numberC = 0;
        });
    });
  }
  onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const progress: number = (this.dataTrack.duration_ms / 100) * Number(value);
    this.musicService.getDevice().subscribe((data) => {
      this.device = data;
      this.musicService
        .seekPosition(progress, this.device.devices[0].id)
        .subscribe(() => {});
      this.numberC = progress;
      this.progressTime = this.numberC;
    });
  }
}
