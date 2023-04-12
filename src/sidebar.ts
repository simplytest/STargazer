import theme from '../pages/theme';
import { executeScript } from './utils/chrome';

function createSidebar(url: string, background: string, handle: string) {
  const old = document.getElementById('stargazer_sidebar');
  const maximumZIndex = '2147483647';

  if (old) {
    old.remove();
  }

  const sidebar = document.createElement('div');
  sidebar.id = 'stargazer_sidebar';

  sidebar.style.background = background;
  sidebar.style.position = 'fixed';
  sidebar.style.height = '100%';
  sidebar.style.width = '400px';

  sidebar.style.top = '0px';
  sidebar.style.right = '0px';

  sidebar.style.border = `1px solid ${background}`;
  sidebar.style.zIndex = maximumZIndex;

  const drag = document.createElement('div');
  drag.style.background = handle;
  drag.style.height = '30px';
  drag.style.cursor = 'grab';
  drag.style.width = '100%';

  const iframe = document.createElement('iframe');
  iframe.style.border = 'none';
  iframe.style.height = '100%';
  iframe.style.width = '100%';
  iframe.src = url;

  sidebar.appendChild(drag);
  sidebar.appendChild(iframe);
  document.body.appendChild(sidebar);

  let move = false;
  let initial = [0, 0];

  const mouseMove = (ev: MouseEvent) => {
    if (!move) {
      return;
    }

    ev.preventDefault();

    const { clientX, clientY } = ev;
    const [initialX, initialY] = initial;

    const diffX = initialX - clientX;
    const diffY = initialY - clientY;

    initial = [clientX, clientY];

    sidebar.style.top = `${sidebar.offsetTop - diffY}px`;
    sidebar.style.left = `${sidebar.offsetLeft - diffX}px`;
  };

  window.removeEventListener('mousemove', mouseMove);
  window.addEventListener('mousemove', mouseMove);

  const dragStart = (ev: MouseEvent) => {
    ev.preventDefault();

    initial = [ev.clientX, ev.clientY];
    move = true;
  };

  drag.removeEventListener('mousedown', dragStart);
  drag.addEventListener('mousedown', dragStart);

  const dragStop = (ev: MouseEvent) => {
    ev.preventDefault();
    move = false;
  };

  drag.removeEventListener('mouseup', dragStop);
  drag.addEventListener('mouseup', dragStop);
}

export async function loadSidebar() {
  await executeScript(
    createSidebar,
    chrome.runtime.getURL('pages/editor/index.html'),
    theme.colors.dark[8],
    theme.colors.dark[6]
  );
}

export async function removeSidebar() {
  await executeScript(() => document.getElementById('stargazer_sidebar').remove());
}

export async function isSidebarActive(): Promise<boolean> {
  return executeScript(() => !!document.getElementById('stargazer_sidebar'));
}
