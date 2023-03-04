import { Selector } from '../../../types/selector';
import scores from '../../scores';

export default function (selector: Selector) {
  if ('attribute' in selector && !selector.value) {
    return scores.awful;
  }

  return 0;
}
