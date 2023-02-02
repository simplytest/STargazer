import { getFromHTML } from '.';
import { Inspected } from '../types/dom';
import { execute, inject } from './chrome';

const canUseDevTools = () => !!chrome.devtools?.inspectedWindow;

async function getDom(): Promise<Document> {
  const html = canUseDevTools()
    ? await execute<string>('document.body.outerHTML')
    : await inject(() => document.body.outerHTML);

  return getFromHTML(html, 'Document');
}

async function getInspected(): Promise<Inspected> {
  const [html, innerText] = canUseDevTools()
    ? await execute<[string, string]>('[$0.outerHTML, $0.innerText]')
    : await inject<[string, string], []>(() => [
        window['indiana_inspected_element'].outerHTML,
        window['indiana_inspected_element'].innerText,
      ]);

  const element = getFromHTML(html, 'Element');
  return { element, html, innerText };
}

async function getInspectedParent(): Promise<[Inspected, number]> {
  const [html, innerText] = canUseDevTools()
    ? await execute<[string, string]>('[$0.parentElement.outerHTML, $0.parentElement.innerText]')
    : await inject<[string, string], []>(() => [
        window['indiana_inspected_element'].parentElement.outerHTML,
        window['indiana_inspected_element'].parentElement.innerText,
      ]);

  const index = canUseDevTools()
    ? await execute<number>('[...$0.parentElement.children].indexOf($0)')
    : await inject<number, []>(() =>
        [...window['indiana_inspected_element'].parentElement.children].indexOf(window['indiana_inspected_element'])
      );

  const element = getFromHTML(html, 'Element');
  return [{ element, html, innerText }, index];
}

async function getInspectedParentCount(): Promise<number> {
  if (!canUseDevTools()) {
    return await inject(() => {
      const parent = (x, n, i = 0) => {
        if (i >= n) {
          return x;
        } else {
          return parent(x.parentElement, n, i + 1);
        }
      };

      let parents = 0;

      for (let i = 0; parent(window['indiana_inspected_element'], i); i++) {
        parents++;
      }

      return parents;
    });
  }

  return await execute<number>(`
    parent = (x, n, i = 0) => { 
      if (i >= n) {
        return x;
      } else {
        return parent(x.parentElement, n, i + 1);
      } 
    };

    parents = 0;

    for (let i = 0; parent($0, i); i++)
    {
      parents++;
    }

    parents;
`);
}

async function getInspectedParentRecursive(n: number): Promise<[Inspected, number]> {
  const [html, innerText, index] = canUseDevTools()
    ? await execute<[string, string, number]>(`
    parent = (x, n, i = 0) => { 
      if (i >= n) {
        return x;
      } else {
        return parent(x.parentElement, n, i + 1);
      } 
    };

    indiana_rtn = parent($0, ${n});
    [indiana_rtn.outerHTML, indiana_rtn.innerText, [...indiana_rtn.parentElement.children].filter(x => x.tagName === indiana_rtn.tagName).indexOf(indiana_rtn)]
  `)
    : await inject<[string, string, number], [number]>(n => {
        const parent = (x, n, i = 0) => {
          if (i >= n) {
            return x;
          } else {
            return parent(x.parentElement, n, i + 1);
          }
        };

        const indiana_rtn = parent(window['indiana_inspected_element'], n);

        return [
          indiana_rtn.outerHTML,
          indiana_rtn.innerText,
          [...indiana_rtn.parentElement.children].filter(x => x.tagName === indiana_rtn.tagName).indexOf(indiana_rtn),
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
