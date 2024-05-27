import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { images } from '../album/album';
import { PlaylistDetail, PlaylistInfo } from './playlist-detail.i';
import { Data } from './playlist.i';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  dataSubject = new BehaviorSubject<PlaylistDetail | null>(null);
  data$ = this.dataSubject.asObservable();

  private myPlaylistSubject = new BehaviorSubject<Data | null>(null);

  constructor(private http: HttpClient) {}

  updateMyPlaylist(data: Data) {
    this.myPlaylistSubject.next(data);
  }

  getMyPlaylistSubject(): Observable<Data | null> {
    return this.myPlaylistSubject.asObservable();
  }

  updateData(data: PlaylistDetail) {
    this.dataSubject.next(data);
  }

  getPlaylist(idPlaylist: string): Observable<PlaylistDetail> {
    return this.http.get<PlaylistDetail>(
      environment.apiConfig + environment.apiPaths.getPlaylist(idPlaylist),
    );
  }

  getInfoPlaylist(id: string): Observable<PlaylistInfo> {
    return this.http.get<PlaylistInfo>(
      environment.apiConfig + environment.apiPaths.infoPlaylist(id),
    );
  }

  getPicture(id: string): Observable<images[]> {
    return this.http.get<images[]>(
      environment.apiConfig + environment.apiPaths.picturePlaylist(id),
    );
  }

  getTrackPlaylist(id: string): Observable<PlaylistDetail> {
    return this.http.get<PlaylistDetail>(
      environment.apiConfig + environment.apiPaths.getTrackPlaylist(id),
    );
  }

  addTrackToPlaylist(id: string, uri: string): Observable<string | object> {
    return this.http.post(
      environment.apiConfig + environment.apiPaths.getTrackPlaylist(id),
      {
        uris: [uri],
      },
    );
  }

  removeTrackFromPlaylist(
    playlistId: string,
    trackUri: string,
  ): Observable<string | object> {
    const url =
      environment.apiConfig + environment.apiPaths.getTrackPlaylist(playlistId);
    const bodies = {
      body: {
        tracks: [
          {
            uri: trackUri,
          },
        ],
      },
    };
    return this.http.delete(url, bodies);
  }
  getMyPlaylist(): Observable<Data> {
    return this.http.get<Data>(
      environment.apiConfig + environment.apiPaths.mePlaylist,
    );
  }

  createPlaylist(id: string, name: string): Observable<Data> {
    const body = {
      name: name,
    };
    return this.http.post<Data>(
      environment.apiConfig + environment.apiPaths.createNewPlaylist(id),
      body,
    );
  }

  updateInfoPlaylist(
    id: string,
    name: string,
    description: string,
  ): Observable<string> {
    const body = {
      name: name,
      description: description,
      public: false,
    };
    return this.http.put<string>(
      environment.apiConfig + environment.apiPaths.updatePlaylistDetail(id),
      body,
    );
  }
  updateImgPlaylist(id: string, img: string): Observable<string> {
    const body = img;
    return this.http.put<string>(
      environment.apiConfig + environment.apiPaths.updateImgPlaylist(id),
      body,
      {
        headers: new HttpHeaders({
          'Content-Type': 'image/jpeg',
        }),
      },
    );
  }

  deletePlaylist(id: string): Observable<object> {
    return this.http.delete(
      environment.apiConfig + environment.apiPaths.deletePlaylist(id),
    );
  }
}
