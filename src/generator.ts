import attributes from './generators/attributes';
import parent from './generators/parent';
import { generateCSS } from './selectors/css';
import { generateXPath } from './selectors/xpath';
import { GeneratorOptions, Result, SelectorOptions } from './types/generator';
import { findByCSS, findByXPath, getDom, getInspected, getInspectedParent } from './utils/dom';

async function generateSelectors({ type, gibberishTolerance, onlyUnique, resultsToDisplay }: SelectorOptions) {
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

  const selectorChains = generated.flat().sort((a, b) => a.length - b.length);

  const generator = type == 'css' ? generateCSS : generateXPath;
  const finder = type == 'css' ? findByCSS : findByXPath;

  const selectors: string[] = selectorChains.map(generator);
  const uniqueSelectors = selectors.filter((x, i) => selectors.indexOf(x) === i);

  let withOccurrences: Result[] = uniqueSelectors.map(x => ({
    selector: x,
    occurrences: finder(dom, x) || 0,
  }));

  if (onlyUnique) {
    withOccurrences = withOccurrences.filter(x => x.occurrences === 1);
  }

  return withOccurrences
    .filter(x => x.occurrences > 0)
    .sort((a, b) => a.selector.length - b.selector.length)
    .sort((a, b) => a.occurrences - b.occurrences)
    .slice(0, resultsToDisplay);
}

export { generateSelectors };
