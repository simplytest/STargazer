import attributes from './generators/attributes';
import parent from './generators/parent';
import { GeneratorOptions, Result } from './types/generator';
import { findBySelector, getDom, getInspected } from './utils/dom';
import { generateXPath } from './utils/selector';

const generators = [attributes, parent];

async function generateSelectors() {
  const inspected = await getInspected();
  const dom = await getDom();

  if (!inspected || !inspected.element) {
    return [];
  }

  const options: GeneratorOptions = { inspected, dom };
  const selectorChains = (await Promise.all(generators.map(generator => generator(options)))).flat();

  const selectors = selectorChains.map(generateXPath);

  const withOccurrences: Result[] = selectors.map(x => ({
    selector: x,
    occurrences: findBySelector(dom, x)?.snapshotLength || 0,
  }));

  return withOccurrences
    .filter(x => x.occurrences > 0)
    .sort((a, b) => a.selector.length - b.selector.length)
    .sort((a, b) => a.occurrences - b.occurrences);
}

export { generateSelectors };
