import { CodeObject } from '../../types/code';
import { escape, indent, label } from '../construct';

export default function translate(obj: CodeObject, level = 0, knownClasses: string[] = []) {
  const rtn: string[] = [];

  if ('variables' in obj) {
    const name = label(obj.name, knownClasses);
    rtn.push(indent(level, `class ${name} {`));
    rtn.push(indent(level + 1, `locators = {`));

    for (const variable of obj.variables) {
      rtn.push(...translate(variable, level + 2, knownClasses));
    }

    rtn.push(indent(level + 1, '}'));
    rtn.push(indent(level, '}'));
  }

  if ('classes' in obj) {
    for (const clazz of obj.classes) {
      rtn.push(...translate(clazz, level, knownClasses));
    }
  }

  const knownVariables: string[] = [];

  if ('value' in obj) {
    const name = label(obj.name, knownVariables);
    rtn.push(indent(level, `${name}: "${escape(obj.value)}",`));
  }

  return rtn;
}
