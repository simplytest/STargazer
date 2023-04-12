export interface Selector {
  selector: string;
  image: string; // <- Base64
  name: string;
}

export interface Page {
  children: (Page | Selector)[];
  name: string;
  url: string;
}

export interface Store {
  children: Page[];
}
