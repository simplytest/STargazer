import attributes from './generators/attributes';
import parent from './generators/parent';
import { score } from './scorer';
import { generateCSS } from './selectors/css';
import { generateXPath } from './selectors/xpath';
import { GeneratorOptions, Result, SelectorOptions } from './types/generator';
import { findByCSS, findByXPath, getDom, getInspected, getInspectedParent } from './utils/dom';

function normalizeRecursive(results: Result[]) {
  for (const result of results) {
    const last = result.chain.at(-1);

    if ('attribute' in last) {
      const others = results.filter(x => {
        const _last = x.chain.at(-1);

        if (!('attribute' in _last)) {
          return false;
        }

        if (_last.attribute !== last.attribute || _last.value !== last.value) {
          return false;
        }

        return true;
      });

      for (const other of others) {
        if (other.chain.length > result.chain.length) {
          other.score -= Math.abs(other.score);
        }
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
  ];

  const selectorChains = generated.flat();

  const generator = type == 'css' ? generateCSS : generateXPath;
  const finder = type == 'css' ? findByCSS : findByXPath;

  const selectors: Partial<Result>[] = selectorChains.map(x => ({
    chain: x,
    selector: generator(x),
  }));

  const uniqueSelectors = selectors.filter(
    (x, i) => selectors.indexOf(selectors.find(y => y.selector == x.selector)) === i
  );

  let withOccurrences: Partial<Result>[] = uniqueSelectors
    .map(x => ({
      ...x,
      occurrences: finder(dom, x.selector) || 0,
    }))
    .filter(x => x.occurrences > 0);

  if (onlyUnique) {
    withOccurrences = withOccurrences.filter(x => x.occurrences === 1);
  }

  let rtn = withOccurrences.map(x => ({ ...x, score: score(x as Result, gibberishTolerance) })) as Result[];

  rtn = normalizeRecursive(rtn);
  rtn = rtn.sort((a, b) => b.score - a.score);
  rtn = rtn.filter(x => x.score > scoreTolerance);

  return rtn.slice(0, resultsToDisplay);
}

export { generateSelectors };
