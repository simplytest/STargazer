import { words as englishWords } from 'enwords';
import { TextScorer } from 'text-scorer';
import { Selector } from '../../../types/selector';

const shouldTest = [
  /^data.+$/, //
  /^class$/,
  /^name$/,
  /^id$/,
];

const textScorer = new TextScorer(true, { ignoreCase: true });

export default function (selector: Selector, gibberishTolerance: number) {
  if (!('attribute' in selector)) {
    return 0;
  }

  if (!shouldTest.find(x => selector.attribute.match(x))) {
    return 0;
  }

  let score = 0;

  if (selector.value.search(/[a-zA-Z]+[0-9]+[a-zA-Z]+/g) !== -1) {
    score -= 100;
  }

  const text = selector.value.replace(/([A-Z])/g, ' $1').replace('-', ' ');
  const words = text.split(' ');

  if (words.length > 1 && words.find(x => x.length === 1)) {
    score -= 50;
  }

  for (const word of words) {
    if (word.length > 1 && englishWords.includes(word.toLowerCase())) {
      score += 15;
    }
  }

  if (score >= 0) {
    const modifier = selector.attribute === 'id' ? 2.6 : 1;
    const gibberishDetails = textScorer.getDetailedWordInfo(words.filter(x => x.length > 1).join(' '));
    const gibberishScore = gibberishDetails.words.map(x => x.score).reduce((sum, current) => sum + current, 0);

    if (gibberishScore * modifier >= gibberishTolerance) {
      score += Math.min(gibberishScore * 100, 20);
    } else {
      score -= Math.abs(gibberishTolerance - score) * 5_000;
    }
  }

  return score;
}
