import { Settings } from '../types/settings';

export const defaultSettings: Settings = {
  type: 'xpath',
  onlyUnique: true,
  resultsToDisplay: 5,
  scoreTolerance: -100,
  gibberishTolerance: 0.028,
};
