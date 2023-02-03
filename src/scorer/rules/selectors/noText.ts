import { Selector } from '../../../types/selector';

export default function (selector: Selector) {
  if (!('text' in selector)) {
    return 0;
  }

  return -50;
}
