import { Inspected } from './inspected';
import { SelectorChain } from './selector';
import { Settings } from './settings';

export interface Result {
  score: number;
  selector: string;
  occurrences: number;
  chain: SelectorChain;
}

export interface GeneratorOptions {
  settings: Settings;
  document: Document;
  inspected?: Inspected;
}
