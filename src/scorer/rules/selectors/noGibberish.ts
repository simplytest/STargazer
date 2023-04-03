import { words as enwords } from 'enwords';
import { TextScorer } from 'text-scorer';
import { Selector } from '../../../types/selector';
import { Settings } from '../../../types/settings';
import scores from '../../scores';
const shouldTest = [/^data.+$/, /^class$/, /^name$/, /^id$/];
const textScorer = new TextScorer(true, { ignoreCase: true });

// We exclude words that are technically in the dictionary but are likely to be gibberish rather than sensible
const excludeWords = ['ln'];

// We're using a map to improve random access performance
const englishWords = new Map((enwords as string[]).map(x => [x, '']));

export default function (selector: Selector, { gibberishTolerance }: Settings) {
  if (!('attribute' in selector)) {
    return 0;
  }

  if (!shouldTest.some(x => selector.attribute.match(x))) {
    return 0;
  }

  let score = 0;

  if (selector.value.search(/[a-zA-Z]+[0-9]+[a-zA-Z]+/g) !== -1) {
    score += scores.atrocious;
  }

  const text = selector.value.replace(/([A-Z])/g, ' $1').replace('-', ' ');
  const words = text.split(' ');

  if (words.length > 1 && words.some(x => x.length === 1)) {
    score += scores.bad;
  }

  if (words.some(word => word.length > 1 && !excludeWords.includes(word) && englishWords.has(word.toLowerCase()))) {
    score += scores.awesome;
  }

  if (score >= 0) {
    const modifier = selector.attribute === 'id' ? 2.6 : 1;
    const gibberishDetails = textScorer.getDetailedWordInfo(words.filter(x => x.length > 1).join(' '));
    const gibberishScore = gibberishDetails.words.map(x => x.score).reduce((sum, current) => sum + current, 0);

    if (gibberishScore * modifier >= gibberishTolerance) {
      score += scores.desired;
    } else {
      score += scores.undesired;
    }
  }

  return score;
}
