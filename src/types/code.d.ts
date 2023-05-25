export interface Variable {
  name: string;
  value: string;
}

export interface Class {
  name: string;
  variables: Variable[];
}

type CodeObject = Class | Variable;
type Translator = (clazz: Class, ...args) => string[];
