import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken: string = '';
  userNameSubject$ = new BehaviorSubject('');
  userName$ = this.userNameSubject$.asObservable();
  nameUser: string;
  tokenUrl = 'https://accounts.spotify.com/api/token';

  constructor(private http: HttpClient) {
    this.accessToken = '';
    this.nameUser = '';
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setRefreshToken(tokenRefresh: string) {
    localStorage.setItem('refreshToken', tokenRefresh);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  login() {
    const params = new URLSearchParams({
      client_id: environment.clientId,
      response_type: 'code',
      redirect_uri: environment.redirectUri,
      scope: environment.scope,
      state: environment.state,
    });
    const authorizeUrl = `https://accounts.spotify.com/authorize?${params}, `;
    window.location.href = authorizeUrl;
    // window.location.reload();
  }

  logout() {
    localStorage.removeItem('token');
    this.http.post(this.tokenUrl, `token=${this.accessToken}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exchangeCode(code: string): Observable<any> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: environment.redirectUri,
    });
    const headers = new HttpHeaders({
      Authorization:
        'Basic ' + btoa(environment.clientId + ':' + environment.clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.tokenUrl, body, { headers });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken!,
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
    });

    return this.http.post(this.tokenUrl, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserinfo(): Observable<any> {
    return this.http.get(environment.apiConfig + '/me');
  }
}
