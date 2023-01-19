import { Inspected } from './dom';
import { SelectorChain } from './selector';

interface Result {
  score: number;
  selector: string;
  occurrences: number;
  chain: SelectorChain;
}

interface SelectorOptions {
  type: 'xpath' | 'css';
  onlyUnique: boolean;
  scoreTolerance: number;
  resultsToDisplay: number;
  gibberishTolerance: number;
}

interface GeneratorOptions {
  dom: Document;
  inspected?: Inspected;
  gibberishTolerance: number;
}

export { Result, SelectorOptions, GeneratorOptions };
