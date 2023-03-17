import attributes from './generators/attributes';
import deepParent from './generators/deepParent';
import { scoreChain, scoreResult } from './scorer';
import scores from './scorer/scores';
import { generateCSS } from './selectors/css';
import { generateXPath } from './selectors/xpath';
import { GeneratorOptions, Result } from './types/generator';
import { Settings } from './types/settings';
import { findBySelector, getDocument } from './utils/dom';
import { getInspected } from './utils/inspected';

async function generate(generator: typeof attributes, options: GeneratorOptions, settings: Settings) {
  const generated = await generator(options);

  const { type } = settings;
  const selectorGenerator = type === 'css' ? generateCSS : generateXPath;

  const selectors = generated.map(x => ({ chain: x, selector: selectorGenerator(x) }));
  return selectors.map(x => ({ ...x, score: scoreChain(x.chain, settings) })) as Result[];
}

async function organize(results: Result[], settings: Settings) {
  let unique = results.filter((result, index) => results.findIndex(x => x.selector === result.selector) === index);
  unique = unique.filter(x => x.score > scores.atrocious);

  for (const result of unique) {
    result.occurrences = await findBySelector(result.selector);
    result.score += scoreResult(result, settings);
  }

  return unique.sort((a, b) => b.score - a.score);
}

export default async function (settings: Settings) {
  const inspected = await getInspected();
  const document = await getDocument();

  if (!inspected || !inspected.element) {
    return [];
  }

  const { gibberishTolerance, scoreTolerance, resultsToDisplay } = settings;
  const options: GeneratorOptions = { inspected, document, gibberishTolerance };

  let rtn = await organize(await generate(attributes, options, settings), settings);
  const best = rtn[0];

  if (!best || best?.score <= scores.average) {
    const additional = await generate(deepParent, options, settings);

    rtn.push(...additional);
    rtn = await organize(rtn, settings);
  }

  const filtered = rtn.filter(x => x.score >= scoreTolerance);

  if (filtered.length >= resultsToDisplay) {
    rtn = filtered;
  }

  return rtn.slice(0, resultsToDisplay);
}
