import { Selector, SelectorChain } from '../types/selector';

function constructConditions(select: Selector) {
  let selector = '';

  if ('attribute' in select) {
    if (select.attribute === 'class') {
      selector += `.${select.value}`;
    } else {
      selector += `[${select.attribute}="${select.value}"]`;
    }
  }

  if ('index' in select) {
    selector += `:nth-child(${select.index})`;
  }

  return selector;
}

function generateCSS(chain: SelectorChain): string {
  let selector = '';

  // ? CSS Selectors can't check for text
  const valid = chain.filter(x => !('text' in x));

  for (const [index, select] of valid.entries()) {
    if ('amend' in select) {
      selector += constructConditions(select);
      continue;
    }

    if (index !== 0) {
      selector += ' > ';
    }

    selector += 'tag' in select ? select.tag : '*';

    selector += constructConditions(select);
  }

  return selector;
}

export { generateCSS };
