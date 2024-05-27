import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class authInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (request.url === 'https://accounts.spotify.com/api/token') {
      return next.handle(request);
    }
    const modifiedRequest = request.clone({
      headers: request.headers.set(
        'Authorization',
        `Bearer ${localStorage.getItem('token')}`,
      ),
    });

    return next.handle(modifiedRequest);
  }
}
