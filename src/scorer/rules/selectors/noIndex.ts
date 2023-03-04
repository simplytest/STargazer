import { Selector } from '../../../types/selector';
import scores from '../../scores';

export default function (selector: Selector) {
  if (!('index' in selector)) {
    return 0;
  }

  return scores.bad;
}
