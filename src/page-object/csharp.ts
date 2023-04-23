import { Page, Selector } from '../types/store';

function fix(name: string) {
  return name.replaceAll(/[^a-zA-Z_]/g, '');
}

function namespace(name: string, indent: number) {
  return `${'\t'.repeat(indent)}namespace ${fix(name)} {\n`;
}

function clazz(name: string, indent: number) {
  return `${'\t'.repeat(indent)}public class ${fix(name)} {\n`;
}

function closingBrace(indent: number) {
  return `${'\t'.repeat(indent)}}\n`;
}

function variable(name: string, value: string, indent: number) {
  const escape = (x: string) => x.replaceAll('"', '\\"');
  return `${'\t'.repeat(indent)}public string ${fix(name)} = "${escape(value)}";\n`;
}

export default function generate(page: Page, output = '', indent = 0) {
  const selectors = page.children.filter(x => 'selector' in x) as Selector[];
  const pages = page.children.filter(x => 'id' in x) as Page[];

  if (selectors.length > 0) {
    output += clazz(page.name, indent);
    indent++;

    for (const selector of selectors) {
      output += variable(selector.name, selector.selector, indent);
    }

    indent--;
    output += closingBrace(indent);
  }

  const useNamespace = selectors.length <= 0 && indent === 0;

  if (useNamespace) {
    output += namespace(page.name, indent);
    indent++;
  }

  for (const subPage of pages) {
    output = generate(subPage, output, indent);
  }

  if (useNamespace) {
    indent--;
    output += closingBrace(indent);
  }

  return output;
}
