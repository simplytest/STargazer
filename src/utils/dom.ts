import { exec } from './chrome';
import { getFromHTML } from './html';

export async function getDocument() {
  const html = await exec(() => document.body.outerHTML);
  return getFromHTML(html, 'Document');
}

export async function findByXPath(selector: string) {
  try {
    return document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
  } catch (error) {
    return undefined;
  }
}

export async function findByCSS(selector: string) {
  try {
    return document.querySelectorAll(selector).length;
  } catch (error) {
    return undefined;
  }
}

export async function findBySelector(selector: string) {
  if (selector.startsWith('//')) {
    return exec(findByXPath, selector);
  }

  return exec(findByCSS, selector);
}

export async function markBySelector(selector: string) {
  return exec(selector => {
    try {
      if (selector.startsWith('//')) {
        const result = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const items = [];

        for (let i = 0; result.snapshotLength > i; i++) {
          items.push(result.snapshotItem(i));
        }

        window.stargazer_marked = items;
        return;
      }

      window.stargazer_marked = [...(document.querySelectorAll(selector) as unknown as HTMLElement[])];
    } catch (error) {
      // Errors are most likely caused by bad selectors, we can ignore them.
    }
  }, selector);
}
