import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { defaultSettings } from '../src/settings/defaults';
import generateSelectors from '../src/generator';
import setup, { setInspected } from './setup';

const html = readFileSync(path.join(__dirname, 'wikipedia.html')).toString();
const fakeDom = new JSDOM(html);

describe('Wikipedia', () => {
  beforeAll(() => {
    setup(fakeDom.window.document);
  });

  it('Selectors for Search-Input', async () => {
    setInspected(fakeDom.window.document.querySelector('#txtSearch'));
    const selectors = await generateSelectors(defaultSettings);

    expect(selectors.length).toBeLessThanOrEqual(defaultSettings.resultsToDisplay);

    expect(selectors.at(0).selector).toBe('#txtSearch');
    expect(selectors.at(1).selector).toBe('[name="q"]');
  });

  it('Selectors for Search-Icon', async () => {
    setInspected(fakeDom.window.document.querySelector('.search-icon'));
    const selectors = await generateSelectors(defaultSettings);

    expect(selectors.length).toBeLessThanOrEqual(defaultSettings.resultsToDisplay);
    expect(selectors.at(0).selector).toBe('.search-icon');
  });

  it('Selectors for Logo', async () => {
    setInspected(fakeDom.window.document.querySelector('.wikipedia-logo a img'));
    const selectors = await generateSelectors(defaultSettings);

    expect(selectors.length).toBeLessThanOrEqual(defaultSettings.resultsToDisplay);
    expect(selectors.at(0).selector).toBe('.wikipedia-logo a img');
  });
});
