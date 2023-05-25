import { Class } from '../types/code';
import { Page, Selector } from '../types/store';

export function filter(name: string) {
  return name.trim().replaceAll(/[^a-zA-Z_]/g, '');
}

export function escape(string: string) {
  return string.replaceAll('"', '\\"');
}

export function indent(level: number, code: string) {
  return `${'\t'.repeat(level)}${code}`;
}

export function label(name: string, knownObjects: string[]) {
  name = filter(name);

  if (name.length === 0) {
    name = 'unknown';
  }

  if (knownObjects.includes(name)) {
    const count = knownObjects.filter(x => x === name).length;
    name = `${name}_${count}`;
  }

  knownObjects.push(name);
  return name;
}

export default function construct(page: Page, classes: Class[] = []) {
  const selectors = page.children.filter(x => 'selector' in x) as Selector[];
  const pages = page.children.filter(x => 'id' in x) as Page[];

  for (const sub of pages) {
    construct(sub, classes);
  }

  if (selectors.length === 0) {
    return classes;
  }

  const clazz: Class = { name: page.name, variables: [] };

  for (const selector of selectors) {
    clazz.variables.push({ name: selector.name, value: selector.selector });
  }

  classes.push(clazz);

  return classes;
}
