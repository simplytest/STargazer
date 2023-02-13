import { Selector } from '../../../types/selector';

const desired: [regex: RegExp, score: number][] = [
  // Best
  [/^data.+$/g, 25],
  [/^id$/g, 25],
  // Good
  [/^name$/g, 10],
  // Average
  [/^class$/g, 2],
  [/^src$/g, 2],
  // Undesired
  [/^type$/g, -10],
  [/^alt$/g, -10],
  [/^on[a-z]+$/g, -25],
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
