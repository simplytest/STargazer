import { Inspected } from '../types/dom';
import { GeneratorOptions } from '../types/generator';
import { Amend, ByIndex, ByTag, Select, SelectorChain } from '../types/selector';
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

  if (parentTag && index !== -1) {
    results.push([{ tag: parentTag } as Select<[ByTag]>, { tag: tagName, index } as Select<[ByTag, ByIndex]>]);
  }

  if (parentSelectors.length === 0) {
    return results;
  }

  for (const selector of selectors) {
    results.push([{ tag: parentTag } as Select<[ByTag]>, ...selector]);
    results.push([{ tag: parentTag } as Select<[ByTag]>, ...selector, Amend({ index } as Select<[ByIndex]>)]);
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
