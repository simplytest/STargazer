import { CodeObject } from '../../types/code';
import { escape, indent, label } from '../construct';

export default function translate(obj: CodeObject, level = 0, known: string[] = []) {
  const rtn: string[] = [];

  if ('variables' in obj) {
    const name = label(obj.name, known);
    rtn.push(indent(level, `export class ${name} {`));
    rtn.push(indent(level + 1, `locators = {`));

    const knownVariables: string[] = [];

    for (const variable of obj.variables) {
      rtn.push(...translate(variable, level + 2, knownVariables));
    }

    rtn.push(indent(level + 1, '}'));
    rtn.push(indent(level, '}'));
  }

  if ('value' in obj) {
    const name = label(obj.name, known);
    rtn.push(indent(level, `${name}: "${escape(obj.value)}",`));
  }

  return rtn;
}
