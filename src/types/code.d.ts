export interface Variable {
  name: string;
  value: string;
}

export interface Class {
  name: string;
  variables: Variable[];
}

export interface Namespace {
  name: string;
  classes: Class[];
}

type CodeObject = Class | Namespace | Variable;
type Translator = (root: Namespace, ...args) => string[];
