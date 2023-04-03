import { Result } from '../../../types/generator';
import { ByTag } from '../../../types/selector';
import scores from '../../scores';

export default function (result: Result) {
  const { chain } = result;
  const standaloneTags = chain.filter(x => Object.keys(x).length === 1 && 'tag' in x) as ByTag[];

  if (standaloneTags.length === chain.length && standaloneTags.at(0).tag != 'body') {
    return scores.unacceptable;
  }

  return 0;
}
