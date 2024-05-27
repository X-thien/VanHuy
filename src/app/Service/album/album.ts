import { Artist } from '../artist/Artists';

export interface Album {
  albums: DataArtist;
}

export interface DataArtist {
  href: string;
  items: Item[];
}

export interface Item {
  href: string;
  id: string;
  images: images[];
  name: string;
  uri: string;
  artists: Artist[];
}

export class images {
  url!: string;
  height!: number;
  width!: number;
}
