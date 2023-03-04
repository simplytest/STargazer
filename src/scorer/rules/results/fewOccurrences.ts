import { Result } from '../../../types/generator';
import scores from '../../scores';

export default function (result: Result) {
  const { occurrences } = result;

  if (occurrences === 1) {
    return scores.desired;
  }

  return scores.awful;
}
