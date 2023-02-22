import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { defaultSettings } from '../src/defaults/settings';
import { generateSelectors } from '../src/generator';
import setup, { setInspected } from './setup';

const html = readFileSync(path.join(__dirname, 'netflix.html')).toString();
const fakeDom = new JSDOM(html);

describe('Netflix', () => {
  beforeAll(() => {
    setup(fakeDom.window.document);
  });

  it('Selectors for Language-Select', async () => {
    setInspected(fakeDom.window.document.querySelector('#lang-switcher-select'));
    const selectors = await generateSelectors(defaultSettings);

    expect(selectors).toHaveLength(3);
    expect(selectors.at(0).selector).toBe('[data-uia="language-picker"]');
    expect(selectors.at(1).selector).toBe('#lang-switcher-select');
  });

  it('Selectors for Step-Indicator', async () => {
    setInspected(fakeDom.window.document.querySelector('.stepIndicator > :nth-child(1)'));
    const selectors = await generateSelectors(defaultSettings);

    expect(selectors).toHaveLength(3);
    expect(selectors.at(0).selector).toBe('.stepIndicator > :nth-child(1)');
    expect(selectors.at(1).selector).toBe('.stepIndicator > b:nth-child(1)');
  });

  it('Selectors for Continue-Button', async () => {
    setInspected(fakeDom.window.document.querySelector('[data-uia="continue-button"]'));
    const selectors = await generateSelectors(defaultSettings);

    expect(selectors).toHaveLength(3);
    expect(selectors.at(0).selector).toBe('[data-uia="continue-button"]');
  });
});
