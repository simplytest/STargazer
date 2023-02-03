import attributes from './generators/attributes';
import parent from './generators/parent';
import recursiveParent from './generators/absolute';
import { score } from './scorer';
import { generateCSS } from './selectors/css';
import { generateXPath } from './selectors/xpath';
import { GeneratorOptions, Result, SelectorOptions } from './types/generator';
import { findByCSS, findByXPath, getDom, getInspected, getInspectedParent } from './utils/dom';

function adjustSelectorsWithParent(results: Result[]) {
  for (const result of results) {
    const lastSelector = result.chain.at(-1);

    if (!('attribute' in lastSelector)) {
      continue;
    }

    for (const other of results) {
      const otherLastSelector = other.chain.at(-1);

      if (!('attribute' in otherLastSelector)) {
        continue;
      }

      if (otherLastSelector.attribute !== lastSelector.attribute) {
        continue;
      }

      if (otherLastSelector.value !== lastSelector.value) {
        continue;
      }

      if (result.occurrences < other.occurrences) {
        other.score -= 100;
      }

      if (result.chain.length < other.chain.length) {
        other.score -= 50;
      }
    }
  }

  return results;
}

async function generateSelectors({
  type,
  gibberishTolerance,
  onlyUnique,
  resultsToDisplay,
  scoreTolerance,
}: SelectorOptions) {
  const inspected = await getInspected();
  const dom = await getDom();

  if (!inspected || !inspected.element) {
    return [];
  }

  const options: GeneratorOptions = { inspected, dom, gibberishTolerance };

  const generated = [
    await attributes(options), //
    await parent(options, await getInspectedParent()), //
    await recursiveParent(options),
  ];

  const selectorChains = generated.flat();

  const generator = type == 'css' ? generateCSS : generateXPath;
  const finder = type == 'css' ? findByCSS : findByXPath;

  const selectors: Partial<Result>[] = selectorChains.map(x => ({
    chain: x,
    selector: generator(x),
  }));

  const withoutDuplicates = selectors.filter(
    (x, i) => selectors.indexOf(selectors.find(y => y.selector == x.selector)) === i
  );

  const withOccurrences: Partial<Result>[] = withoutDuplicates
    .map(x => ({
      ...x,
      occurrences: finder(dom, x.selector) || 0,
    }))
    .filter(x => (onlyUnique ? x.occurrences === 1 : x.occurrences > 0));

  let rtn: Result[] = withOccurrences.map((x: Result) => ({ ...x, score: score(x, gibberishTolerance) }));

  rtn = adjustSelectorsWithParent(rtn);
  rtn = rtn.sort((a, b) => b.score - a.score);
  rtn = rtn.filter(x => x.score > scoreTolerance);

  return rtn.slice(0, resultsToDisplay);
}

export { generateSelectors };
