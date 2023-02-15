import { JSDOM } from 'jsdom';
import { exec } from '../src/utils/chrome';
import { getFromHTML } from '../src/utils/html';

jest.mock('../src/utils/chrome');
jest.mock('../src/utils/html');

const mockGetFromHtml = getFromHTML as jest.MockedFunction<typeof getFromHTML>;
mockGetFromHtml.mockImplementation((html, type: unknown) => {
  let rtn: unknown = undefined;

  switch (type) {
    case 'Document':
      rtn = new JSDOM(html).window.document;
      break;
    case 'Element':
      rtn = new JSDOM(html).window.document.body.firstElementChild;
      break;
  }

  return rtn as Document;
});

const mockExec = exec as jest.MockedFunction<typeof exec>;
mockExec.mockImplementation((fn, args) => Promise.resolve(fn(args)));
Object.defineProperty(global, 'chrome', { value: { devtools: undefined } });

export default function (dom: Document, inspected: HTMLElement) {
  Object.defineProperty(global, 'document', { value: dom });
  Object.defineProperty(global, 'window', { value: { stargazer_inspected: inspected } });
}
