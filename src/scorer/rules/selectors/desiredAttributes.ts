import { Selector } from '../../../types/selector';
import scores from '../../scores';

const desired = [
  {
    score: scores.awesome,
    matches: [/^id$/g, /^data.+$/g],
  },
  {
    score: scores.undesired,
    matches: [/^name$/g],
  },
  {
    score: scores.hideous,
    matches: [/^src$/g, /^href$/g, /^target$/g, /^alt$/g, /^title$/g, /^type$/g, /^placeholder$/g],
  },
];

export default function (selector: Selector) {
  if (!('attribute' in selector)) {
    return 0;
  }

  return desired.find(x => x.matches.some(match => selector.attribute.match(match)))?.score ?? 0;
}
