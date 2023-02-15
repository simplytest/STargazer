import { removeHighlights } from '../../src/highlight';

chrome.devtools.panels.elements.createSidebarPane('STargazer', sidebar => {
  const port = chrome.runtime.connect();
  sidebar.setPage('/pages/devtools/index.html');
  port.onDisconnect.addListener(() => removeHighlights());
});
