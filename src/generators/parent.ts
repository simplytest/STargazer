import { GeneratorOptions } from '../types/generator';
import { getInspectedParent } from '../utils/dom';
import attributes from './attributes';

export default async function ({ inspected, dom }: GeneratorOptions): Promise<string[]> {
  const results: string[] = [];

  const { element } = inspected;

  const parent = await getInspectedParent();
  const { element: parentElement } = parent;

  const children = Array.from(parentElement.children).filter(x => x.tagName === element.tagName);
  const index = children.indexOf(children.find(x => x.outerHTML === element.outerHTML)); //TODO: This is error prone!

  const parentTag = parentElement.tagName.toLowerCase();
  const tagName = element.tagName.toLowerCase();

  if (!parent) {
    return results;
  }

  const parentSelectors = await attributes({ dom, inspected: parent, type: 'xpath' });
  const selectors = await attributes({ dom, inspected, type: 'xpath' });

  if (parentTag && index !== -1) {
    results.push(`//${parentTag}/${tagName}[${index + 1}]`);
  }

  if (parentSelectors.length === 0) {
    return results;
  }

  for (const selector of selectors) {
    results.push(`//${parentTag}${selector.substring(1)}`);
    results.push(`//${parentTag}${selector.substring(1)}[${index + 1}]`);
  }

  for (const parentSelector of parentSelectors) {
    if (tagName && index !== -1) {
      results.push(`${parentSelector}/${tagName}[${index + 1}]`);
    }

    for (const selector of selectors) {
      results.push(`${parentSelector}${selector.substring(1)}`);
    }
  }

  return results;
}
