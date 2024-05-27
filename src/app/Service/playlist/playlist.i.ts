import { images } from '../album/album';
import { PlaylistInfo } from './playlist-detail.i';

export interface Playlist {
  message: string;
  playlists: Data;
}

export interface Data {
  href: string;
  items: PlaylistInfo[];
}

export interface Item {
  href?: string;
  id?: string;
  images: images[];
  name?: string;
  type?: string;
  uri?: string;
}
