import { Class, Namespace } from '../types/code';
import { Page, Selector } from '../types/store';

export function filter(name: string) {
  return name.replaceAll(/[^a-zA-Z_]/g, '');
}

export function escape(string: string) {
  return string.replaceAll('"', '\\"');
}

export function indent(level: number, code: string) {
  return `${'\t'.repeat(level)}${code}`;
}

export function label(name: string, knownObjects: string[]) {
  name = filter(name);

  if (knownObjects.includes(name)) {
    const count = knownObjects.filter(x => x === name).length;
    name = `${name}_${count}`;
  }

  knownObjects.push(name);
  return name;
}

export default function construct(page: Page, namespace?: Namespace) {
  const selectors = page.children.filter(x => 'selector' in x) as Selector[];
  const pages = page.children.filter(x => 'id' in x) as Page[];

  if (!namespace) {
    const name = selectors.length === 0 ? page.name : 'STargazer';
    namespace = { name: name, classes: [] };
  }

  for (const sub of pages) {
    construct(sub, namespace);
  }

  if (selectors.length === 0) {
    return namespace;
  }

  const clazz: Class = { name: page.name, variables: [] };

  for (const selector of selectors) {
    clazz.variables.push({ name: selector.name, value: selector.selector });
  }

  namespace.classes.push(clazz);

  return namespace;
}
