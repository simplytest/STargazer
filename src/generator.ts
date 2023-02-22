import recursiveParent from './generators/absolute';
import attributes from './generators/attributes';
import parent from './generators/parent';
import { score } from './scorer';
import { generateCSS } from './selectors/css';
import { generateXPath } from './selectors/xpath';
import { GeneratorOptions, Result } from './types/generator';
import { Settings } from './types/settings';
import { findBySelector, getDocument } from './utils/dom';
import { getInspected, getParent } from './utils/inspected';

function normalizeParent(results: Result[]) {
  for (const result of results) {
    if (result.chain.length !== 1 || result.occurrences !== 1) {
      continue;
    }

    const selector = result.chain.at(0);
    const others = results.filter(x => x.chain.includes(selector));

    for (const other of others) {
      if (other.chain.length > 1) {
        other.score -= result.score;
      }
    }
  }

  return results;
}

async function generateSelectors({ type, gibberishTolerance, onlyUnique, resultsToDisplay, scoreTolerance }: Settings) {
  const inspected = await getInspected();
  const document = await getDocument();

  if (!inspected || !inspected.element) {
    return [];
  }

  const options: GeneratorOptions = { inspected, document, gibberishTolerance };

  const generated = [
    await attributes(options), //
    await parent(options, await getParent()), //
    await recursiveParent(options),
  ];

  const selectorChains = generated.flat();
  const generator = type === 'css' ? generateCSS : generateXPath;

  const selectors: Partial<Result>[] = selectorChains.map(x => ({
    chain: x,
    selector: generator(x),
  }));

  const withoutDuplicates = selectors.filter(
    (x, i) => selectors.indexOf(selectors.find(y => y.selector === x.selector)) === i
  );

  let withOccurrences: Partial<Result>[] = [];

  for (const selector of withoutDuplicates) {
    const occurrences = await findBySelector(selector.selector);
    withOccurrences.push({ ...selector, occurrences });
  }

  withOccurrences = withOccurrences.filter(x => (onlyUnique ? x.occurrences === 1 : x.occurrences > 0));

  let rtn: Result[] = withOccurrences.map((x: Result) => ({ ...x, score: score(x, gibberishTolerance) }));

  rtn = normalizeParent(rtn);
  rtn = rtn = rtn.sort((a, b) => b.score - a.score);

  const withTolerance = rtn.filter(x => x.score > scoreTolerance);

  if (withTolerance.length > 0) {
    rtn = withTolerance;
  }

  return rtn.slice(0, resultsToDisplay);
}

export { generateSelectors };
