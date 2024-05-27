import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './Layout/default-layout/default-layout.component';
import { authGuard } from './guard/auth.guard';
import { HomeComponent } from './page/home/home.component';
import { CallbackComponent } from './page/callback/callback.component';
import { ArtistComponent } from './page/artist/artist.component';
import { AlbumsComponent } from './page/albums/albums.component';
import { PlaylistsComponent } from './page/play-list-detail/playlists.component';
import { SearchComponent } from './page/search/search.component';

export const routes: Routes = [
  {
    path: 'callback',
    component: CallbackComponent,
  },

  {
    path: '',
    component: DefaultLayoutComponent,

    children: [
      {
        path: 'artist/:id',
        component: ArtistComponent,
      },
      {
        path: 'albums/:id',
        component: AlbumsComponent,
      },

      {
        path: 'playlist/:id',
        component: PlaylistsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'search',
        component: SearchComponent,
        canActivate: [authGuard],
      },
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
];
