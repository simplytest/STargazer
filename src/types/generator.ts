import { Inspected } from './dom';

interface Result {
  selector: string;
  occurrences: number;
}

interface SelectorOptions {
  type: 'xpath' | 'css';
  onlyUnique: boolean;
  resultsToDisplay: number;
  gibberishTolerance: number;
}

interface GeneratorOptions {
  dom: Document;
  inspected?: Inspected;
  gibberishTolerance: number;
}

export { Result, SelectorOptions, GeneratorOptions };
