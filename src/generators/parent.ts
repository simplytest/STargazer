import { GeneratorOptions } from '../types/generator';
import { InspectedParent } from '../types/inspected';
import { SelectorChain } from '../types/selector';
import { select } from '../utils/selector';
import attributes from './attributes';

export default async function (
  { inspected, document, gibberishTolerance }: GeneratorOptions,
  { parent, index }: InspectedParent
): Promise<SelectorChain[]> {
  const results: SelectorChain[] = [];

  const { element } = inspected;
  const { element: parentElement } = parent;

  const parentTag = parentElement.tagName.toLowerCase();
  const tagName = element.tagName.toLowerCase();

  if (!parent) {
    return results;
  }

  const parentSelectors = await attributes({ document, inspected: parent, gibberishTolerance });
  const selectors = await attributes({ document, inspected, gibberishTolerance });

  if (index !== -1) {
    selectors.push([select({ index })]);
    results.push([select({ tag: parentTag }), select({ index })]);
    parentTag && results.push([select({ tag: parentTag }), select({ tag: tagName, index })]);
  }

  if (parentSelectors.length === 0) {
    return results;
  }

  for (const selector of selectors) {
    results.push([select({ tag: parentTag }), ...selector]);

    const remaining = selector.slice(0, -1);
    const last = select({ ...selector.at(-1), index });
    results.push([select({ tag: parentTag }), ...remaining, last]);
  }

  for (const parentSelector of parentSelectors) {
    if (tagName && index !== -1) {
      results.push([...parentSelector, select({ tag: tagName, index })]);
    }

    for (const selector of selectors) {
      results.push([...parentSelector, ...selector]);
    }
  }

  return results;
}
