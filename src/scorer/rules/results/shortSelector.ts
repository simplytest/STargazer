import { Result } from '../../../types/generator';

export default function (result: Result) {
  const { chain } = result;

  if (chain.length === 1) {
    return 25;
  }

  return -(Math.pow(chain.length, 8) * Math.pow(2, -2));
}
