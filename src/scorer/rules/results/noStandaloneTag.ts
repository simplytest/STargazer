import { Result } from '../../../types/generator';
import scores from '../../scores';

export default function (result: Result) {
  const { chain } = result;
  const standaloneTags = chain.filter(x => Object.keys(x).length === 1 && 'tag' in x);

  if (standaloneTags.length === chain.length) {
    return scores.unacceptable;
  }

  return 0;
}
