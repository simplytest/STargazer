import { CodeObject } from '../../types/code';
import { escape, indent, label } from '../construct';

export default function translate(obj: CodeObject, level = 0, known: string[] = []) {
  const rtn: string[] = [];

  if ('variables' in obj) {
    const name = label(obj.name, known);
    rtn.push(indent(level, `public class ${name} {\n`));

    // Constructor
    rtn.push(indent(level + 1, `public ${name}() {`));
    rtn.push(indent(level + 2, `// Initialize your WebDriver`));
    rtn.push(indent(level + 1, `}\n`));

    const knownVariables: string[] = [];

    for (const variable of obj.variables) {
      rtn.push(...translate(variable, level + 1, knownVariables));
    }

    rtn.push(indent(level, '}'));
  }

  if ('classes' in obj) {
    for (const clazz of obj.classes) {
      rtn.push(...translate(clazz, level, known));
    }
  }

  if ('value' in obj) {
    const name = label(obj.name, known);
    rtn.push(indent(level, `private String ${name} = "${escape(obj.value)}";`));
  }

  return rtn;
}
