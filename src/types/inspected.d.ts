export interface Inspected {
  html: string;
  element: Element;
  innerText: string;
}

export interface InspectedParent {
  index: number;
  parent: Inspected;
}
