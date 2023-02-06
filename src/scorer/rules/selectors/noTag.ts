import { Selector } from '../../../types/selector';

export default function (selector: Selector) {
  if (!('tag' in selector)) {
    return 0;
  }

  return -50;
}
