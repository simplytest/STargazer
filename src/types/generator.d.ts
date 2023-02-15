import { InspectedElement } from './inspected';
import { SelectorChain } from './selector';

export interface Result {
  score: number;
  selector: string;
  occurrences: number;
  chain: SelectorChain;
}

export interface GeneratorOptions {
  document: Document;
  gibberishTolerance: number;
  inspected?: InspectedElement;
}
