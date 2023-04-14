import { words as enwords } from 'enwords';
import { Selector } from '../../../types/selector';
import scores from '../../scores';

const shouldTest = [/^data.+$/, /^class$/, /^name$/, /^id$/];

// We exclude words that are technically in the dictionary but are likely to be gibberish rather than sensible
const excludeWords = ['ln'];

// We're using a map to improve random access performance
const englishWords = new Map((enwords as string[]).map(x => [x, '']));

export default function (selector: Selector) {
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

  const text = selector.value.replace(/([A-Z-])/g, ' $1').replace('-', ' ');
  const words = text.split(' ');

  if (words.length > 1 && words.some(x => x.length === 1)) {
    score += scores.atrocious;
  }

  const goodWords = words.filter(
    word => word.length > 1 && !excludeWords.includes(word) && englishWords.has(word.toLowerCase())
  );

  score += scores.awesome * Math.min(goodWords.length, 2);

  if (score == 0) {
    if (selector.value.length > 1) {
      score += scores.awful;
    }
    if (selector.value.length === 1) {
      score += scores.desired;
    }
  }

  return score;
}
