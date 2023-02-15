export interface ByTag {
  tag: string;
}

export interface ByText {
  text: string;
}

export interface ByIndex {
  index: number;
}

export interface ByAttribute {
  attribute: string;
  value: string;
}

export type Selector = ByTag | ByText | ByIndex | ByAttribute;
export type SelectorChain = Selector[];
