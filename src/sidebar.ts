import { inject } from './utils/chrome';

function createSidebar(url: string, background: string) {
  const old = document.getElementById('indiana_sidebar');
  const maximumZIndex = '2147483647';

  if (old) {
    old.remove();
  }

  const sidebar = document.createElement('iframe');
  sidebar.id = 'indiana_sidebar';

  sidebar.style.background = background;
  sidebar.style.position = 'fixed';
  sidebar.style.height = '100%';
  sidebar.style.width = '400px';

  sidebar.style.top = '0px';
  sidebar.style.right = '0px';

  sidebar.style.border = `1px solid ${background}`;
  sidebar.style.zIndex = maximumZIndex;

  sidebar.src = url;
  document.body.appendChild(sidebar);
}

async function load(color: string) {
  await inject(createSidebar, chrome.runtime.getURL('pages/editor/index.html'), color);
}

async function loaded(): Promise<boolean> {
  const result = await inject(() => !!document.getElementById('indiana_sidebar'));
  return result;
}

export { createSidebar, load, loaded };
