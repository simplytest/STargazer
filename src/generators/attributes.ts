import { GeneratorOptions } from '../types/generator';
import { SelectorChain } from '../types/selector';
import { select } from '../utils/selector';

const excludeList = [
  /^js[a-z]+/g,
  /^on[a-z]+/g,

  /^width$/g,
  /^height$/g,

  /^style$/g,

  /^lang$/g,
  /length/g,
  /^xmlns$/g,
  /^placeholder$/g,
  /^autocomplete$/g,

  /^class$/g,
];

export default async function ({ inspected }: GeneratorOptions): Promise<SelectorChain[]> {
  const { innerText, element } = inspected;

  const results: SelectorChain[] = [];
  const tagName = element.tagName.toLowerCase();

  const attributes = element.getAttributeNames();
  const allowedAttributes = attributes.filter(x => !excludeList.find(y => x.match(y)));

  tagName && results.push([select({ tag: tagName })]);

  for (const attribute of allowedAttributes) {
    results.push([
      select({
        attribute: attribute,
        value: element.getAttribute(attribute),
      }),
    ]);

    tagName &&
      results.push([
        select({
          tag: tagName,
          attribute: attribute,
          value: element.getAttribute(attribute),
        }),
      ]);
  }

  if (attributes.includes('class')) {
    const classes = element.getAttribute('class').split(' ');

    for (const clazz of classes) {
      results.push([
        select({
          attribute: 'class',
          value: clazz,
        }),
      ]);

      tagName &&
        results.push([
          select({
            tag: tagName,
            attribute: 'class',
            value: clazz,
          }),
        ]);
    }
  }

  if (!innerText) {
    return results;
  }

  const snapshot = [...results];

  for (const result of snapshot) {
    results.push([...result, select({ text: innerText })]);
  }

  results.push([select({ text: innerText })]);
  tagName && results.push([select({ tag: tagName, text: innerText })]);

  return results;
}
