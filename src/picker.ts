import { executeScript } from './utils/chrome';

function loadPicker() {
  const old = document.getElementById('stargazer_inspect');
  const maximumZIndex = '2147483647';

  if (old) {
    old.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'stargazer_inspect';

  overlay.style.width = '0px';
  overlay.style.height = '0px';

  overlay.style.top = '0px';
  overlay.style.left = '0px';
  overlay.style.position = 'absolute';
  overlay.style.zIndex = maximumZIndex;

  overlay.style.border = '1px solid #05F';
  overlay.style.background = 'rgba(0, 85, 255, 0.4)';

  overlay.onmousedown = ev => {
    const { clientX, clientY } = ev;

    overlay.style.display = 'none';
    window.stargazer_inspected = document.elementFromPoint(clientX, clientY) as HTMLElement;

    chrome.runtime.sendMessage(null, { name: 'Selected' });
    overlay.remove();
  };

  const sidebar = document.getElementById('stargazer_sidebar');

  if (sidebar) {
    sidebar.parentElement.insertBefore(overlay, sidebar);
  } else {
    document.appendChild(overlay);
  }

  document.addEventListener('mousemove', e => {
    const { target, clientX, clientY } = e;
    const id: string = 'id' in target ? (target.id as string) : '';

    const overSelf = id.includes('stargazer_');

    if (overSelf) {
      overlay.style.display = 'none';
    }

    const element = document.elementFromPoint(clientX, clientY);

    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();

    const documentElement = document.documentElement;

    const topOffset = window.scrollY - documentElement.clientTop;
    const leftOffset = window.scrollX - documentElement.clientLeft;

    overlay.style.top = `${bounds.top + topOffset}px`;
    overlay.style.left = `${bounds.left + leftOffset}px`;

    overlay.style.width = `${bounds.width}px`;
    overlay.style.height = `${bounds.height}px`;

    if (overSelf) {
      overlay.style.display = 'inline';
    }
  });
}

function unloadPicker() {
  const inspect = document.getElementById('stargazer_inspect');

  if (!inspect) {
    return;
  }

  inspect.remove();
}

export async function startPicking() {
  await executeScript(loadPicker);
}

export async function stopPicking() {
  await executeScript(unloadPicker);
}
