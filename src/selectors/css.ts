import { Selector, SelectorChain } from '../types/selector';

function construct(select: Selector) {
  let selector = '';

  if ('attribute' in select) {
    if (select.attribute === 'id') {
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

export function generateCSS(chain: SelectorChain): string {
  let selector = '';

  // ? CSS Selectors can't check for text
  if (chain.find(x => 'text' in x)) {
    return selector;
  }

  for (const [index, select] of chain.entries()) {
    if (index !== 0) {
      selector += ' ';
    }

    if ('tag' in select) {
      selector += select.tag;
    }

    selector += construct(select);
  }

  return selector;
}
