export interface Settings {
  onlyUnique: boolean;
  scoreTolerance: number;
  resultsToDisplay: number;

  type: 'xpath' | 'css';
}
