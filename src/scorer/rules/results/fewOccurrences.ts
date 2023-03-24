import { Result } from '../../../types/generator';
import { Settings } from '../../../types/settings';
import scores from '../../scores';

export default function (result: Result, { onlyUnique }: Settings) {
  const { occurrences } = result;

  if (occurrences === 1) {
    return scores.desired;
  }

  if (!occurrences || (onlyUnique && occurrences != 1)) {
    return scores.unacceptable;
  }

  return scores.awful;
}
