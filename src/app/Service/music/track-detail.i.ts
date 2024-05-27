import { AlbumDetail } from '../album/album-detail.i';
import { Artist } from '../artist/Artists';

export interface TrackDetail {
  album: AlbumDetail;
  artists: Artist[];
  duration_ms: number;
  href: string;
  id: string;
  name: string;
  preview_url: string;
  type: string;
  uri: string;
  popularity: number;
}
