import { Inspected } from '../types/dom';
import { GeneratorOptions } from '../types/generator';
import { ByIndex, ByTag, Select, SelectorChain } from '../types/selector';
import attributes from './attributes';

export default async function (
  { inspected, dom, gibberishTolerance }: GeneratorOptions,
  [parent, index]: [Inspected, number]
): Promise<SelectorChain[]> {
  const results: SelectorChain[] = [];

  const { element } = inspected;
  const { element: parentElement } = parent;

  const parentTag = parentElement.tagName.toLowerCase();
  const tagName = element.tagName.toLowerCase();

  if (!parent) {
    return results;
  }

  const parentSelectors = await attributes({ dom, inspected: parent, gibberishTolerance });
  const selectors = await attributes({ dom, inspected, gibberishTolerance });

  if (index !== -1) {
    selectors.push([{ index }]);
    results.push([{ tag: parentTag }, { index }]);
    parentTag && results.push([{ tag: parentTag }, { tag: tagName, index }]);
  }

  if (parentSelectors.length === 0) {
    return results;
  }

  for (const selector of selectors) {
    results.push([{ tag: parentTag } as Select<[ByTag]>, ...selector]);

    const remaining = selector.slice(0, -1);
    const last: unknown & Select<[ByIndex]> = { ...selector.at(-1), index };
    results.push([{ tag: parentTag } as Select<[ByTag]>, ...remaining, last]);
  }

  for (const parentSelector of parentSelectors) {
    if (tagName && index !== -1) {
      results.push([...parentSelector, { tag: tagName, index } as Select<[ByTag, ByIndex]>]);
    }

    for (const selector of selectors) {
      results.push([...parentSelector, ...selector]);
    }
  }

  return results;
}
