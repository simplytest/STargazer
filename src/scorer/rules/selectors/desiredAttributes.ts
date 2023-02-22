import { Selector } from '../../../types/selector';

const desired: [regex: RegExp, score: number][] = [
  // Best
  [/^data.+$/g, 35],
  [/^id$/g, 30],
  // Good
  [/^name$/g, 10],
  // Average
  [/^src$/g, 2],
  // Undesired
  [/^class$/g, -5],
  [/^type$/g, -10],
  [/^alt$/g, -10],
  [/^placeholder$/g, -10],
  [/^type$/g, -15],
];

export default function (selector: Selector) {
  if (!('attribute' in selector)) {
    return 0;
  }

  const score = desired.find(x => selector.attribute.match(x[0]));

  if (!score) {
    return 0;
  }

  return score[1];
}
