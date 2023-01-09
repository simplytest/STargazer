import { TextScorer } from 'text-scorer';
import { GeneratorOptions } from '../types/generator';

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

function attributeSelector(prefix: string, attribute: string, value: string) {
  return [`${prefix}[${attribute} = "${value}"]`, `${prefix}[contains(${attribute}, "${value}")]`];
}

export default async function ({ inspected }: GeneratorOptions): Promise<string[]> {
  const { innerText, element } = inspected;

  const results: string[] = [];
  const tagName = element.tagName.toLowerCase();

  const attributes = element.getAttributeNames();
  const allowedAttributes = attributes.filter(x => !excludeList.includes(x));

  for (const attribute of allowedAttributes) {
    results.push(...attributeSelector('//*', `@${attribute}`, element.getAttribute(attribute)));
    tagName && results.push(...attributeSelector(`//${tagName}`, `@${attribute}`, element.getAttribute(attribute)));
  }

  if (attributes.includes('class')) {
    const classes = element.getAttribute('class').split(' ');

    for (const clazz of classes) {
      if (textScorer.getTextScore(clazz) < 0.08) {
        continue;
      }

      results.push(attributeSelector('//*', `@class`, clazz)[1]);
      tagName && results.push(attributeSelector(`//${tagName}`, `@class`, clazz)[1]);
    }
  }

  if (!innerText) {
    return results;
  }

  const snapshot = [...results];

  for (const result of snapshot) {
    const joinableResult = result.slice(0, -1);
    const textChecks = attributeSelector('', 'text()', innerText);

    for (const check of textChecks) {
      results.push(`${joinableResult} and ${check.substring(1)}`);
    }
  }

  results.push(...attributeSelector('//*', 'text()', innerText));
  tagName && results.push(...attributeSelector(`//${tagName}`, 'text()', innerText));

  return results;
}
