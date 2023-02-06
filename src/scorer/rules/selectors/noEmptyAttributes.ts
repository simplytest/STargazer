import { Selector } from '../../../types/selector';

export default function (selector: Selector) {
  if (!('attribute' in selector)) {
    return 0;
  }

  if (!selector.value) {
    return -500;
  }

  return 0;
}
