import { Selector } from '../../../types/selector';
import scores from '../../scores';

export default function (selector: Selector) {
  if ('attribute' in selector && !selector.value) {
    return scores.unacceptable;
  }

  return 0;
}
