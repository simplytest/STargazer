import { Selector } from '../../../types/selector';
import scores from '../../scores';

export default function (selector: Selector) {
  if ('tag' in selector && Object.keys(selector).length > 1) {
    return scores.atrocious;
  }

  return 0;
}
