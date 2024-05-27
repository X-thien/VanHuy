import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from './album';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  constructor(private http: HttpClient) {}

  getAlbumNew(): Observable<Album> {
    return this.http.get<Album>(
      environment.apiConfig + environment.apiPaths.getNewAlbum,
    );
  }
}
