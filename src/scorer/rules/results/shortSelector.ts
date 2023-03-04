import { Result } from '../../../types/generator';
import scores from '../../scores';

export default function (result: Result) {
  const { chain } = result;

  if (chain.length === 1) {
    return scores.good;
  }

  return Math.pow(2, chain.length) * scores.bad;
}
