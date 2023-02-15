import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { defaultSettings } from '../src/defaults/settings';
import { generateSelectors } from '../src/generator';
import setup from './setup';

const html = readFileSync(path.join(__dirname, 'wikipedia.html')).toString();

const fakeDom = new JSDOM(html);
setup(fakeDom.window.document, fakeDom.window.document.querySelector('#txtSearch'));

describe('Wikipedia', () => {
  const settings = defaultSettings;
  settings.type = 'css';

  it('Selectors for Search-Input', async () => {
    const selectors = await generateSelectors(settings);

    expect(selectors).toHaveLength(5);
    expect(selectors.at(0).selector).toBe('#txtSearch');
    expect(selectors.at(1).selector).toBe('[name="q"]');
  });
});
