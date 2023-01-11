import { Inspected } from './dom';

interface Result {
  selector: string;
  occurrences: number;
}

interface GeneratorOptions {
  dom: Document;
  inspected?: Inspected;
}

export { Result, GeneratorOptions };
