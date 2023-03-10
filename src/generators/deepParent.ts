import { scoreChain } from '../scorer';
import scores from '../scorer/scores';
import { GeneratorOptions } from '../types/generator';
import { SelectorChain } from '../types/selector';
import { getParentAmount, getParentRecursive } from '../utils/inspected';
import { select } from '../utils/selector';
import attributes from './attributes';

export default async function ({ document, gibberishTolerance }: GeneratorOptions): Promise<SelectorChain[]> {
  const MAX_DEPTH = 5;

  const results = new Map<number, SelectorChain[]>();
  const parents = await getParentAmount();

  const children = new Map<number, SelectorChain[]>();

  for (let i = 0; MAX_DEPTH > i; i++) {
    if (i >= parents) {
      break;
    }

    const { parent, index } = await getParentRecursive(i);
    const selectors: SelectorChain[] = [];

    index >= 0 && selectors.push([select({ index })]);

    const attributeSelectors = await attributes({ inspected: parent, document, gibberishTolerance });

    for (const attributeSelector of attributeSelectors) {
      if (scoreChain(attributeSelector, gibberishTolerance) < scores.average) {
        continue;
      }

      selectors.push(attributeSelector);
    }

    children.set(i, selectors);
  }

  results.set(0, children.get(0));

  for (let i = 1; children.size > i; i++) {
    const parent = children.get(i);
    const child = results.get(i - 1);

    const selectors = [];

    for (const parentSelector of parent) {
      for (const childSelector of child) {
        selectors.push([...parentSelector, ...childSelector]);
      }
    }

    results.set(i, selectors);
  }

  return [...results.values()].flat();
}
