import attributes from './generators/attributes';
import parent from './generators/parent';
import { generateCSS } from './selectors/css';
import { generateXPath } from './selectors/xpath';
import { GeneratorOptions, Result } from './types/generator';
import { findByCSS, findByXPath, getDom, getInspected } from './utils/dom';

const generators = [attributes, parent];

async function generateSelectors(type: 'xpath' | 'css', gibberishTolerance: number) {
  const inspected = await getInspected();
  const dom = await getDom();

  if (!inspected || !inspected.element) {
    return [];
  }

  const options: GeneratorOptions = { inspected, dom, gibberishTolerance };
  const selectorChains = (await Promise.all(generators.map(generator => generator(options)))).flat();

  const generator = type == 'css' ? generateCSS : generateXPath;
  const finder = type == 'css' ? findByCSS : findByXPath;

  const selectors = selectorChains.map(generator);
  const uniqueSelectors = selectors.filter((x, i) => selectors.indexOf(x) === i);

  const withOccurrences: Result[] = uniqueSelectors.map(x => ({
    selector: x,
    occurrences: finder(dom, x) || 0,
  }));

  return withOccurrences
    .filter(x => x.occurrences > 0)
    .sort((a, b) => a.selector.length - b.selector.length)
    .sort((a, b) => a.occurrences - b.occurrences);
}

export { generateSelectors };
