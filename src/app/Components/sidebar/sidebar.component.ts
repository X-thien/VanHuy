import { Component, HostListener, OnInit } from '@angular/core';
// import { PlaylistService } from '../../Service/PlayList/playlist.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Service/auth/auth.service';
import { Data } from '../../Service/playlist/playlist.i';
import { PlaylistService } from '../../Service/playlist/playlist.service';
import { EditInfoPlaylistComponent } from '../edit-info-playlist/edit-info-playlist.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, EditInfoPlaylistComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  id: string = '';
  myPlaylist!: Data;
  showMenuId: string = '';
  constructor(
    private playlistService: PlaylistService,
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.authService.getUserinfo().subscribe(() => {
      this.loadMyPlaylist();
    });
  }

  loadMyPlaylist() {
    this.playlistService.getMyPlaylist().subscribe((dataMy) => {
      this.playlistService.updateMyPlaylist(dataMy);
      // this.myPlaylist = data;
      this.playlistService.getMyPlaylistSubject().subscribe((data) => {
        if (data) {
          this.myPlaylist = data;
        }
      });
    });
  }

  createPlaylist() {
    this.authService.getUserinfo().subscribe((data) => {
      this.playlistService
        .createPlaylist(
          data.id,
          `My Playlist #` + (this.myPlaylist.items.length + 1),
        )
        .subscribe(() => {
          this.playlistService.getMyPlaylist().subscribe((data) => {
            this.myPlaylist = data;
          });
        });
    });
  }

  handleRightClick(event: Event, id: string) {
    event.preventDefault();
    this.showMenuId = id;
  }

  @HostListener('document:click', ['event'])
  closeMenu() {
    this.showMenuId = '';
  }

  deletePlaylist(id: string) {
    this.playlistService.deletePlaylist(id).subscribe(() => {
      this.loadMyPlaylist();
      this.router.navigate(['/']);
    });
  }
}
