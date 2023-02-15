import { Inspected } from './inspected';
import { SelectorChain } from './selector';

export interface Result {
  score: number;
  selector: string;
  occurrences: number;
  chain: SelectorChain;
}

export interface GeneratorOptions {
  document: Document;
  inspected?: Inspected;
  gibberishTolerance: number;
}
