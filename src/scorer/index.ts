import { Result } from '../types/generator';
import { SelectorChain } from '../types/selector';
import fewOccurrences from './rules/results/fewOccurrences';
import noStandaloneTag from './rules/results/noStandaloneTag';
import shortSelector from './rules/results/shortSelector';
import desiredAttributes from './rules/selectors/desiredAttributes';
import noEmptyAttributes from './rules/selectors/noEmptyAttributes';
import noGibberish from './rules/selectors/noGibberish';
import noIndex from './rules/selectors/noIndex';
import noText from './rules/selectors/noText';
import standaloneTag from './rules/selectors/standaloneTag';

const resultRules = [fewOccurrences, shortSelector, noStandaloneTag];
const selectorRules = [desiredAttributes, noEmptyAttributes, standaloneTag, noGibberish, noText, noIndex];

export function scoreChain(chain: SelectorChain, gibberishTolerance: number) {
  let rtn = 0;

  for (let i = 0; chain.length > i; i++) {
    const selector = chain.at(i);

    for (const rule of selectorRules) {
      const score = rule(selector, gibberishTolerance);
      rtn += score * Math.pow(2, -i);
    }
  }

  return rtn;
}

export function scoreResult(result: Result, gibberishTolerance: number) {
  let score = 0;

  for (const rule of resultRules) {
    score += rule(result);
  }

  score += scoreChain(result.chain, gibberishTolerance);

  return score;
}
