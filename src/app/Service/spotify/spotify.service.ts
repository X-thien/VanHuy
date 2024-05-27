///  <reference types="@types/spotify-web-playback-sdk"/>
import { Injectable } from '@angular/core';
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor() {}

  spotifyPlayer!: Spotify.Player;
  // private spotifyToken!: string;
  device: string | null = null;
  createWebPlayer(spotifyToken: string) {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.type = 'text/javascript';
    script.addEventListener('load', (e) => {
      console.log(e);
    });
    document.head.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.spotifyPlayer = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getOAuthToken: (cb: any) => {
          cb(spotifyToken);
        },
        volume: 0.5,
      });

      this.spotifyPlayer.addListener('ready', () => {});

      this.spotifyPlayer.addListener('not_ready', () => {});

      this.spotifyPlayer.addListener(
        'initialization_error',
        ({ message }: { message: string }) => {
          console.error(message);
        },
      );

      this.spotifyPlayer.addListener(
        'authentication_error',
        ({ message }: { message: string }) => {
          console.error(message);
        },
      );

      this.spotifyPlayer.addListener(
        'account_error',
        ({ message }: { message: string }) => {
          console.error(message);
        },
      );

      this.spotifyPlayer.connect();
    };
  }
}
