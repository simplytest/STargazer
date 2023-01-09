import attributes from './generators/attributes';
import parent from './generators/parent';
import { GeneratorOptions, Result } from './types/generator';
import { findBySelector, getDom, getInspected } from './utils/dom';

const generators = [attributes, parent];

async function generateSelectors() {
  const inspected = await getInspected();
  const dom = await getDom();

  if (!inspected || !inspected.element) {
    return [];
  }

  const options: GeneratorOptions = { inspected, dom, type: 'xpath' };
  const selectors = (await Promise.all(generators.map(generator => generator(options)))).flat();

  const withOccurrences: Result[] = selectors.map(x => ({
    selector: x,
    occurrences: findBySelector(dom, x).snapshotLength,
  }));

  return withOccurrences
    .filter(x => x.occurrences > 0)
    .sort((a, b) => a.selector.length - b.selector.length)
    .sort((a, b) => a.occurrences - b.occurrences);
}

export { generateSelectors };
