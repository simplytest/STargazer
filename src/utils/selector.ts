import { Selector } from '../types/selector';

export function select<T extends Selector>(by: T) {
  return by;
}
