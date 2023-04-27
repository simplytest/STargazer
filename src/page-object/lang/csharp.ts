import { CodeObject } from '../../types/code';
import { escape, indent, label } from '../construct';

export default function translate(obj: CodeObject, level = 0, knownGlobals: string[] = []) {
  const rtn: string[] = [];

  if ('variables' in obj) {
    const name = label(obj.name, knownGlobals);
    rtn.push(indent(level, `public class ${name} {\n`));

    // Constructor
    rtn.push(indent(level + 1, `public ${name}() {`));
    rtn.push(indent(level + 2, `// Initialize your WebDriver`));
    rtn.push(indent(level + 1, `}\n`));

    for (const variable of obj.variables) {
      rtn.push(...translate(variable, level + 1, knownGlobals));
    }

    rtn.push(indent(level, '}'));
  }

  if ('classes' in obj) {
    const name = label(obj.name, knownGlobals);
    rtn.push(indent(level, `namespace ${name} {`));

    for (const clazz of obj.classes) {
      rtn.push(...translate(clazz, level + 1, knownGlobals));
    }

    rtn.push(indent(level, '}'));
  }

  const knownVariables: string[] = [];

  if ('value' in obj) {
    const name = label(obj.name, knownVariables);
    rtn.push(indent(level, `private string ${name} = "${escape(obj.value)}";`));
  }

  return rtn;
}
