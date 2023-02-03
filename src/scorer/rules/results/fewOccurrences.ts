import { Result } from '../../../types/generator';

export default function (result: Result) {
  const { occurrences } = result;

  if (occurrences === 1) {
    return 25;
  }

  return -(occurrences * 100);
}
