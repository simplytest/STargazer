import { TextScorer } from 'text-scorer';
import { Result } from './types/generator';
import { Selector } from './types/selector';

const attributeScores: [regex: RegExp, score: number][] = [
  // Best
  [/^data.+$/g, 25],
  [/^id$/g, 15],
  // Good
  [/^name$/g, 10],
  // Average
  [/^class$/g, 2],
  [/^src$/g, 2],
  [/^alt$/g, 1],
];

const gibberishTest = [
  /^data-*$/, //
  /^class$/,
  /^name$/,
  /^id$/,
];

const textScorer = new TextScorer(true, {
  ignoreCase: true,
});

function scoreSelector(selector: Selector, gibberishTolerance: number) {
  let score = 0;

  if ('text' in selector) {
    score -= 5;
  }

  if ('tag' in selector) {
    const keys = Object.keys(selector);

    if (keys.length === 1) {
      score -= 7;
    } else {
      score -= 5;
    }
  }

  if ('attribute' in selector) {
    if (!selector.value) {
      score -= 25;
      return score;
    }

    const shouldTest = gibberishTest.find(x => selector.attribute.match(x));

    if (shouldTest) {
      const gibberishScore = textScorer.getTextScore(selector.value);
      const delta = 1 / gibberishTolerance;

      const gibFn = (x: number) => {
        const d = x > 5 ? 0.01 : 5;
        return d * Math.pow(x - 4, 3) - 1;
      };

      score += Math.min(gibFn(gibberishScore * delta * 5), 20);
    } else {
      const scorer = attributeScores.find(x => selector.attribute.match(x[0]));
      score += (scorer && scorer[1]) || 0;
    }
  }

  return score;
}

export function score(result: Result, gibberishTolerance: number) {
  const scores = result.chain.map(x => scoreSelector(x, gibberishTolerance));
  let score = scores.reduce((p, c) => p + c);

  //? https://www.geogebra.org/calculator/gx2rnqks (f)
  const occFn = (x: number) => (Math.pow(Math.sqrt(x), 2) / x) * Math.pow(-x, 15) + 2;
  score += occFn(result.occurrences);

  //? https://www.geogebra.org/calculator/gx2rnqks (g)
  const lenFn = (x: number) => Math.pow(Math.sqrt(x), 2) / x - Math.pow(x, 4) + 2;
  score += lenFn(result.chain.length);

  return score;
}
