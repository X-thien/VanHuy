import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MusicService } from '../music/music.service';
import { TopTrack } from './top-track.i';
import { AlbumDetail } from '../album/album-detail.i';
import { Track } from '../music/track';
import { Artist } from '../artist/Artists';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private http: HttpClient,
    private music: MusicService,
  ) {}

  getTrackArtist(id: string): Observable<TopTrack> {
    return this.http.get<TopTrack>(
      environment.apiConfig + environment.apiPaths.getTrackArtist(id),
    );
  }

  formatMillisecondsToMinutesAndSeconds(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    return formattedTime;
  }

  getArtist(id: string): Observable<Artist> {
    return this.http.get<Artist>(
      environment.apiConfig + environment.apiPaths.getArtist(id),
    );
  }

  getTrackAlbum(id: string): Observable<Track> {
    return this.http.get<Track>(
      environment.apiConfig + environment.apiPaths.getTrackAlbum(id),
    );
  }

  getAlbumDetail(id: string): Observable<AlbumDetail> {
    return this.http.get<AlbumDetail>(
      environment.apiConfig + environment.apiPaths.getAlbumDetail(id),
    );
  }
}
