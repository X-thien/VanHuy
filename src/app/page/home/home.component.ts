import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArtistComponent } from '../artist/artist.component';
import { Album } from '../../Service/album/album';
import { AlbumService } from '../../Service/album/album.service';
import { Artist } from '../../Service/artist/Artists';
import { AuthService } from '../../Service/auth/auth.service';
import { MusicService } from '../../Service/music/music.service';
import { Track } from '../../Service/music/track';
import { Playlist } from '../../Service/playlist/playlist.i';
import { PlaylistService } from '../../Service/playlist/playlist.service';
// import { Login } from '../login/login.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, ArtistComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  tracks: Track[] = [];
  topTracks!: Playlist;
  token!: string | null;
  artists: Artist[] = [];
  id: string;
  albumNew!: Album;
  getTopTrack!: Subscription;
  getAlbumSub!: Subscription;
  constructor(
    private albumService: AlbumService,
    private authService: AuthService,
    private musicService: MusicService,
    private playlistService: PlaylistService,
  ) {
    this.tracks = [];
    this.id = '';
  }
  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.getTopTrack = this.musicService
        .getTopTrack()
        .subscribe((data: Playlist) => {
          this.topTracks = data;
          this.getAlbumSub = this.albumService
            .getAlbumNew()
            .subscribe((data: Album) => {
              if (data) this.albumNew = data;
            });
        });
    }
  }

  ngOnDestroy(): void {
    this.getTopTrack.unsubscribe();
    this.getAlbumSub.unsubscribe();
  }

  login() {
    this.authService.login();
  }

  handelClick() {
    this.authService.login();
  }
}
