import { getFromHTML } from './html';
import { Inspected } from '../types/dom';
import { execute, inject } from './chrome';

async function exec<R, T extends unknown[]>(func: (...args: T) => R, ...args: T) {
  const devToolsAvailable = !!chrome.devtools?.inspectedWindow;

  if (!devToolsAvailable) {
    return inject<R, T>(func, ...args);
  }

  const serializedFunc = func.toString().replaceAll(/window\[.indiana_inspected.\]/gi, '$0');
  return execute<R>(`(${serializedFunc})(${args})`);
}

async function getDom(): Promise<Document> {
  const html = await exec(() => document.body.outerHTML);
  return getFromHTML(html, 'Document');
}

async function getInspected(): Promise<Inspected> {
  const [html, innerText] = await exec(() => {
    const element: HTMLElement = window['indiana_inspected'];
    return [element.outerHTML, element.innerText];
  });

  const element = getFromHTML(html, 'Element');
  return { element, html, innerText };
}

async function getInspectedParent(): Promise<[Inspected, number]> {
  const [html, innerText] = await exec(() => {
    const element: HTMLElement = window['indiana_inspected'];
    return [element.parentElement.outerHTML, element.parentElement.innerText];
  });

  const index = await exec(() => {
    const element: HTMLElement = window['indiana_inspected'];
    return [...(element.parentElement.children as unknown as HTMLElement[])].indexOf(element);
  });

  const element = getFromHTML(html, 'Element');
  return [{ element, html, innerText }, index];
}

async function getInspectedParentCount(): Promise<number> {
  return await exec(() => {
    const element: HTMLElement = window['indiana_inspected'];

    const parent = (x: HTMLElement, n: number, i = 0) => {
      if (i >= n) {
        return x;
      } else {
        return parent(x.parentElement, n, i + 1);
      }
    };

    let parents = 0;

    for (let i = 0; parent(element, i); i++) {
      parents++;
    }

    return parents;
  });
}

async function getInspectedParentRecursive(n: number): Promise<[Inspected, number]> {
  const [html, innerText, index] = await exec(n => {
    const element: HTMLElement = window['indiana_inspected'];

    const parent = (x: HTMLElement, n: number, i = 0) => {
      if (i >= n) {
        return x;
      } else {
        return parent(x.parentElement, n, i + 1);
      }
    };

    const rtn = parent(element, n);

    return [
      rtn.outerHTML,
      rtn.innerText,
      [...rtn.parentElement.children].filter(x => x.tagName === rtn.tagName).indexOf(rtn),
    ];
  }, n);

  const element = getFromHTML(html, 'Element');
  return [{ element, html, innerText }, index];
}

function findByXPath(dom: Document, selector: string): number {
  try {
    return dom.evaluate(selector, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
  } catch (error) {
    return undefined;
  }
}

function findByCSS(dom: Document, selector: string): number {
  try {
    return dom.querySelectorAll(selector).length;
  } catch (error) {
    return undefined;
  }
}

export {
  getDom,
  getInspected,
  findByXPath,
  findByCSS,
  getInspectedParent,
  getInspectedParentCount,
  getInspectedParentRecursive,
};
