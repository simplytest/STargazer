import { TextScorer } from 'text-scorer';
import { Selector } from '../../../types/selector';

const shouldTest = [
  /^data-*$/, //
  /^class$/,
  /^name$/,
  /^id$/,
];

const textScorer = new TextScorer(true, {
  ignoreCase: true,
});

export default function (selector: Selector, gibberishTolerance: number) {
  if (!('attribute' in selector)) {
    return 0;
  }

  if (!shouldTest.find(x => selector.attribute.match(x))) {
    return 0;
  }

  const score = textScorer.getTextScore(selector.value);

  if (score < gibberishTolerance) {
    return -((gibberishTolerance - score) * 5_000);
  }

  return Math.min(score * 1000, 20);
}
