import { Selector, SelectorChain } from '../types/selector';

function constructConditions(select: Selector, conditions: number) {
  let selector = '';

  if (conditions > 0) {
    selector += '[';
  }

  if ('text' in select) {
    conditions -= 1;
    selector += `text() = "${select.text}"${conditions > 0 ? ' and ' : ']'}`;
  }

  if ('attribute' in select) {
    conditions -= 2;

    if (select.attribute === 'class') {
      selector += `contains(@${select.attribute}, "${select.value}")${conditions > 0 ? ' and ' : ']'}`;
    } else {
      selector += `@${select.attribute} = "${select.value}"${conditions > 0 ? ' and ' : ']'}`;
    }
  }

  if ('index' in select) {
    selector += `[${select.index + 1}]`;
  }

  return selector;
}

function generateXPath(chain: SelectorChain): string {
  let selector = '//';

  for (const [index, select] of chain.entries()) {
    let conditions = Object.entries(select).length;

    if (index !== 0) {
      selector += '/';
    }

    if ('tag' in select) {
      conditions -= 1;
      selector += select.tag;
    } else {
      selector += '*';
    }

    if (conditions <= 0) {
      continue;
    }

    if ('index' in select) {
      conditions -= 1;
    }

    selector += constructConditions(select, conditions);
  }

  return selector;
}

export { generateXPath };
