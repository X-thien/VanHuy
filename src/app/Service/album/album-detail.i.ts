import { Artist } from '../artist/Artists';
import { images } from './album';

export class AlbumDetail {
  id!: string;
  name!: string;
  images!: images[];
  artists!: Artist[];
  uri!: string;
}
