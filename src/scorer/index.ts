import { Result } from '../types/generator';
import fewOccurrences from './rules/results/fewOccurrences';
import shortSelector from './rules/results/shortSelector';
import desiredAttributes from './rules/selectors/desiredAttributes';
import noEmptyAttributes from './rules/selectors/noEmptyAttributes';
import noGibberish from './rules/selectors/noGibberish';
import noTag from './rules/selectors/noTag';
import noText from './rules/selectors/noText';

const resultRules = [fewOccurrences, shortSelector];
const selectorRules = [desiredAttributes, noEmptyAttributes, noGibberish, noTag, noText];

export function score(result: Result, gibberishTolerance: number) {
  let score = 0;

  for (const rule of resultRules) {
    score += rule(result);
  }

  for (let i = 0; result.chain.length > i; i++) {
    const selector = result.chain.at(i);

    for (const rule of selectorRules) {
      const rating = rule(selector, gibberishTolerance);
      score += rating * (rating > 0 ? Math.pow(2, -i) : 1);
    }
  }

  return score;
}
