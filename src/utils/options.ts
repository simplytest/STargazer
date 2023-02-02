import { SelectorOptions } from '../types/generator';

const defaultOptions: SelectorOptions = {
  type: 'xpath',
  onlyUnique: true,
  resultsToDisplay: 5,
  scoreTolerance: -100,
  gibberishTolerance: 0.073,
};

async function saveOptions(options: SelectorOptions) {
  await chrome.storage.local.set({ options });
}

async function getOptions(): Promise<SelectorOptions> {
  const result = await chrome.storage.local.get(['options']);
  return result?.options || defaultOptions;
}

export { defaultOptions, saveOptions, getOptions };
