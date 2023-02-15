chrome.devtools.panels.elements.createSidebarPane('STargazer', sidebar => {
  chrome.runtime.connect();
  sidebar.setPage('/pages/devtools/index.html');
});
