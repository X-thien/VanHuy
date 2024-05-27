export interface Track {
  items: Item[];
}

export interface Item {
  duration_ms: number;
  href: string;
  id: string;
  name: string;
  preview_url: string;
  type: string;
  uri: string;
}
