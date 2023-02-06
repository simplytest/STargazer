import { Selector, SelectorChain } from '../types/selector';

function constructConditions(select: Selector) {
  let selector = '';

  if ('attribute' in select) {
    if (select.attribute == 'id') {
      selector += `#${select.value}`;
    } else if (select.attribute === 'class') {
      selector += `.${select.value}`;
    } else {
      selector += `[${select.attribute}="${select.value}"]`;
    }
  }

  if ('index' in select) {
    selector += `:nth-child(${select.index + 1})`;
  }

  return selector;
}

function generateCSS(chain: SelectorChain): string {
  let selector = '';

  // ? CSS Selectors can't check for text
  if (chain.indexOf(chain.find(x => 'text' in x)) !== -1) {
    return selector;
  }

  for (const [index, select] of chain.entries()) {
    if (index !== 0) {
      selector += ' > ';
    }

    if ('tag' in select) {
      selector += select.tag;
    }

    selector += constructConditions(select);
  }

  return selector;
}

export { generateCSS };
