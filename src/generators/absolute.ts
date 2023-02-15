import { GeneratorOptions } from '../types/generator';
import { SelectorChain } from '../types/selector';
import { getParentAmount, getParentRecursive } from '../utils/inspected';
import { select } from '../utils/selector';
import attributes from './attributes';

export default async function ({ document, gibberishTolerance }: GeneratorOptions): Promise<SelectorChain[]> {
  const results = new Map<number, SelectorChain[]>();
  const parents = await getParentAmount();

  const children = new Map<number, SelectorChain[]>();

  for (let i = 0; parents - 1 > i; i++) {
    const { parent, index } = await getParentRecursive(i);
    const selectors: SelectorChain[] = [];

    if (i === 0) {
      const attributeSelectors = await attributes({ inspected: parent, document, gibberishTolerance });
      selectors.push(...attributeSelectors);
    }

    const tag = parent.element.tagName.toLowerCase();
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
