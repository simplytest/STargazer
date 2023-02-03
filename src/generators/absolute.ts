import { GeneratorOptions } from '../types/generator';
import { select, SelectorChain } from '../types/selector';
import { getInspectedParentCount, getInspectedParentRecursive } from '../utils/dom';
import attributes from './attributes';

export default async function ({ dom, gibberishTolerance }: GeneratorOptions): Promise<SelectorChain[]> {
  const results = new Map<number, SelectorChain[]>();
  const parents = await getInspectedParentCount();

  const children = new Map<number, SelectorChain[]>();

  for (let i = 0; parents - 1 > i; i++) {
    const [current, index] = await getInspectedParentRecursive(i);
    const selectors: SelectorChain[] = [];

    if (i === 0) {
      const attributeSelectors = await attributes({ inspected: current, dom, gibberishTolerance });
      selectors.push(...attributeSelectors);
    }

    const tag = current.element.tagName.toLowerCase();
    tag && index >= 0 && selectors.push([select({ tag, index })]);

    children.set(i, selectors);
  }

  for (let i = 1; parents - 1 > i; i++) {
    const currentSelectors = children.get(i);
    const childSelectors = children.get(i - 1);

    const selectors = [];

    if (i > 1) {
      const previousResults = results.get(i - 1);

      for (const current of currentSelectors) {
        for (const previous of previousResults) {
          selectors.push([...current, ...previous]);
        }
      }
    } else {
      for (const current of currentSelectors) {
        for (const previous of childSelectors) {
          selectors.push([...current, ...previous]);
        }
      }
    }

    results.set(i, selectors);
  }

  return [...results.values()].flat();
}
