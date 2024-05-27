import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/auth.service';
import { Playlist } from '../playlist/playlist.i';
import { TrackDetail } from './track-detail.i';
import { Device } from './device.i';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  dataSubject = new BehaviorSubject<TrackDetail | null>(null);
  data$ = this.dataSubject.asObservable();

  playSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}
  // getData() {
  //   return this.data$;
  // }
  getData(): Observable<TrackDetail | null> {
    this.updateData();
    return this.data$;
  }

  updateData() {
    const storedDataString = localStorage.getItem('trackCurrent');
    if (storedDataString !== null) {
      const storedData: TrackDetail = JSON.parse(storedDataString!);
      if (storedData) this.dataSubject.next(storedData);
    }
  }

  playTrack(
    uri: string,
    progress_ms: number,
    devicesId: string,
  ): Observable<object> {
    const params = new URLSearchParams({
      device_id: devicesId,
    });
    return this.http.put(
      environment.apiConfig + environment.apiPaths.playMusic + `?${params}`,
      {},
    );
  }

  playTrackA(
    uri: string[],
    index: number,
    devicesId: string,
  ): Observable<object> {
    const params = new URLSearchParams({
      device_id: devicesId,
    });
    return this.http.put(
      environment.apiConfig + environment.apiPaths.playMusic + `?${params}`,
      {
        uris: uri,
        offset: {
          position: index,
        },
      },
    );
  }

  playList(
    uri: string,
    progress_ms: number,
    devicesId: string,
    position: number,
  ): Observable<object> {
    const params = new URLSearchParams({
      device_id: devicesId,
    });
    return this.http.put(
      environment.apiConfig + environment.apiPaths.playMusic + `?${params}`,
      {
        // context_uri: 'spotify:album:1FbCsMN3QbJzyChn0JpPf7',
        context_uri: uri,
        offset: {
          position: position,
        },
        position_ms: progress_ms,
      },
    );
  }

  pauseTrack(): Observable<object> {
    return this.http.put(
      environment.apiConfig + environment.apiPaths.pauseMusic,
      {},
    );
  }

  getTopTrack(): Observable<Playlist> {
    const params = new URLSearchParams({
      locale: 'VN',
      limit: '10',
    });
    return this.http.get<Playlist>(
      environment.apiConfig + environment.apiPaths.topTrack + `?${params}`,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCurrentPlaying(): Observable<any> {
    return this.http.get(
      environment.apiConfig + environment.apiPaths.currentPlay,
    );
  }

  getDevice(): Observable<Device> {
    return this.http.get<Device>(
      environment.apiConfig + environment.apiPaths.getDevice,
    );
  }

  nextMusic(deviceId: string): Observable<object> {
    return this.http.post<object>(
      environment.apiConfig + environment.apiPaths.next(deviceId),
      {},
    );
  }

  preMusic(deviceId: string): Observable<object> {
    return this.http.post<object>(
      environment.apiConfig + environment.apiPaths.previous(deviceId),
      {},
    );
  }
  getTrack(id: string): Observable<TrackDetail> {
    return this.http.get<TrackDetail>(
      environment.apiConfig + environment.apiPaths.getTrack(id),
    );
  }

  seekPosition(positionMs: number, deviceId: string): Observable<object> {
    const params = new URLSearchParams({
      position_ms: Math.floor(positionMs).toString(),
      device_id: deviceId,
    });
    return this.http.put<object>(
      environment.apiConfig +
        environment.apiPaths.seek +
        `?${params.toString()}`,
      {},
    );
  }
}
