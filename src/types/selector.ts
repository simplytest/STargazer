interface ByTag {
  tag: string;
}

interface ByText {
  text: string;
}

interface ByIndex {
  index: number;
}

interface ByAttribute {
  attribute: string;
  value: string;
}

type Selector = ByTag | ByText | ByIndex | ByAttribute;
type SelectorChain = Selector[];

function select<T extends Selector>(by: T) {
  return by;
}

export { ByTag, ByText, ByIndex, ByAttribute, Selector, SelectorChain, select };
