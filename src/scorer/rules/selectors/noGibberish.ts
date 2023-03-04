import { words as englishWords } from 'enwords';
import { TextScorer } from 'text-scorer';
import { Selector } from '../../../types/selector';
import scores from '../../scores';

const shouldTest = [/^data.+$/, /^class$/, /^name$/, /^id$/];
const textScorer = new TextScorer(true, { ignoreCase: true });

export default function (selector: Selector, gibberishTolerance: number) {
  if (!('attribute' in selector)) {
    return 0;
  }

  if (!shouldTest.some(x => selector.attribute.match(x))) {
    return 0;
  }

  let score = 0;

  if (selector.value.search(/[a-zA-Z]+[0-9]+[a-zA-Z]+/g) !== -1) {
    score += scores.awful;
  }

  const text = selector.value.replace(/([A-Z])/g, ' $1').replace('-', ' ');
  const words = text.split(' ');

  if (words.length > 1 && words.some(x => x.length === 1)) {
    score += scores.bad;
  }

  if (words.some(word => word.length > 1 && englishWords.includes(word.toLowerCase()))) {
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
