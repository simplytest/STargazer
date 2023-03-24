import { Inspected, InspectedParent } from '../types/inspected';
import { exec } from './chrome';
import { getFromHTML } from './html';

export async function getInspected(): Promise<Inspected> {
  const [html, innerText] = await exec(() => {
    const element = window.stargazer_inspected;
    return [element?.outerHTML, element?.innerText];
  });

  const element = getFromHTML(html, 'Element');
  return { element, html, innerText };
}

export async function getParent(): Promise<InspectedParent> {
  const [html, innerText] = await exec(() => {
    const element = window.stargazer_inspected;
    return [element.parentElement.outerHTML, element.parentElement.innerText];
  });

  const index = await exec(() => {
    const element = window.stargazer_inspected;
    return [...((element.parentElement?.children as unknown as HTMLElement[]) ?? [])].indexOf(element);
  });

  const element = getFromHTML(html, 'Element');
  return { parent: { element, html, innerText }, index };
}

export async function getParentAmount() {
  return exec(() => {
    const parent = (element: HTMLElement, n: number, i = 0) => {
      if (i >= n) {
        return element;
      }

      return parent(element.parentElement, n, i + 1);
    };

    let parents = 0;

    for (let i = 0; parent(window.stargazer_inspected, i); i++) {
      parents++;
    }

    return parents;
  });
}

export async function getParentRecursive(amount: number): Promise<InspectedParent> {
  const [html, innerText, index] = await exec(amount => {
    const parent = (element: HTMLElement, amount: number, i = 0) => {
      if (i >= amount) {
        return element;
      }

      return parent(element.parentElement, amount, i + 1);
    };

    const rtn = parent(window.stargazer_inspected, amount);

    return [
      rtn.outerHTML,
      rtn.innerText,
      [...(rtn.parentElement?.children ?? [])].filter(x => x && x.tagName === rtn.tagName).indexOf(rtn),
    ];
  }, amount);

  const element = getFromHTML(html, 'Element');
  return { parent: { element, html, innerText }, index };
}
