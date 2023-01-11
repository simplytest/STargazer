import { TextScorer } from 'text-scorer';
import { GeneratorOptions } from '../types/generator';
import { ByAttribute, ByTag, ByText, Select, SelectorChain } from '../types/selector';

const textScorer = new TextScorer(true, {
  ignoreCase: true,
});

const excludeList = [
  'jscontroller',
  'jsaction',
  'data-ved',
  'data-iml',
  'data-atf',
  'tabindex',
  'data-frt',
  'jsmodel',
  'jsname',
  'jsdata',
  'height',
  'xmlns',
  'width',
  'style',
  'class',
];

export default async function ({ inspected, gibberishTolerance }: GeneratorOptions): Promise<SelectorChain[]> {
  const { innerText, element } = inspected;

  const results: SelectorChain[] = [];
  const tagName = element.tagName.toLowerCase();

  const attributes = element.getAttributeNames();
  const allowedAttributes = attributes.filter(x => !excludeList.includes(x));

  tagName && results.push([{ tag: tagName } as Select<[ByTag]>]);

  for (const attribute of allowedAttributes) {
    results.push([
      {
        attribute: attribute,
        value: element.getAttribute(attribute),
      } as Select<[ByAttribute]>,
    ]);

    tagName &&
      results.push([
        {
          tag: tagName,
          attribute: attribute,
          value: element.getAttribute(attribute),
        } as Select<[ByTag, ByAttribute]>,
      ]);
  }

  if (attributes.includes('class')) {
    const classes = element.getAttribute('class').split(' ');

    for (const clazz of classes) {
      if (textScorer.getTextScore(clazz) < gibberishTolerance) {
        continue;
      }

      results.push([
        {
          attribute: 'class',
          value: clazz,
        } as Select<[ByAttribute]>,
      ]);

      tagName &&
        results.push([
          {
            tag: tagName,
            attribute: 'class',
            value: clazz,
          } as Select<[ByTag, ByAttribute]>,
        ]);
    }
  }

  if (!innerText) {
    return results;
  }

  const snapshot = [...results];

  for (const result of snapshot) {
    results.push([...result, { text: innerText } as Select<[ByText]>]);
  }

  results.push([{ text: innerText } as Select<[ByText]>]);
  tagName && results.push([{ tag: tagName, text: innerText } as Select<[ByTag, ByText]>]);

  return results;
}
