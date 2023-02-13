import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { generateSelectors } from '../src/generator';
import { defaultOptions } from '../src/utils/options';
import setup from './setup';

const html = readFileSync(path.join(__dirname, 'wikipedia.html')).toString();

const fakeDom = new JSDOM(html);
setup(fakeDom.window.document, fakeDom.window.document.querySelector('#txtSearch'));

describe('Wikipedia', () => {
  const options = defaultOptions;
  options.type = 'css';

  it('Selectors for Search-Input', async () => {
    const selectors = await generateSelectors(options);

    expect(selectors).toHaveLength(5);
    expect(selectors.at(0).selector).toBe('#txtSearch');
    expect(selectors.at(1).selector).toBe('[name="q"]');
  });
});
