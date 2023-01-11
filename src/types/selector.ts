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

type Select<T extends unknown[]> = T extends [infer F, ...infer R] ? F & Select<R> : unknown;

function Amend<T extends ByIndex>(selector: T) {
  selector['amend'] = true;
  return selector;
}

export { ByTag, ByText, ByIndex, ByAttribute, Selector, SelectorChain, Select, Amend };
