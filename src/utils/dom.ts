import { getFromHTML } from '.';
import { Inspected } from '../types/dom';
import { execute } from './chrome';

async function getDom(): Promise<Document> {
  const html = await execute<string>('document.body.outerHTML');
  return getFromHTML(html, 'Document');
}

async function getInspected(): Promise<Inspected> {
  const [html, innerText] = await execute<[string, string]>('[$0.outerHTML, $0.innerText]');
  const element = getFromHTML(html, 'Element');

  return { element, html, innerText };
}

async function getInspectedParent(): Promise<[Inspected, number]> {
  const [html, innerText] = await execute<[string, string]>('[$0.parentElement.outerHTML, $0.parentElement.innerText]');
  const index = await execute<number>('[...$0.parentElement.children].indexOf($0)');
  const element = getFromHTML(html, 'Element');

  return [{ element, html, innerText }, index];
}

function findBySelector(dom: Document, selector: string): XPathResult | undefined {
  try {
    return dom.evaluate(selector, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  } catch (error) {
    return undefined;
  }
}

export { getDom, getInspected, findBySelector, getInspectedParent };
