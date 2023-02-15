export interface Settings {
  onlyUnique: boolean;
  scoreTolerance: number;
  resultsToDisplay: number;
  gibberishTolerance: number;

  type: 'xpath' | 'css';
}
