import { executeScript } from './utils/chrome';
import { markBySelector } from './utils/dom';

function highlight() {
  const old = document.getElementsByName('stargazer_highlight');
  old.forEach(element => element.remove());
  const maximumZIndex = '2147483647';

  if (!window.stargazer_marked) {
    return;
  }

  const sidebar = document.getElementById('stargazer_sidebar');

  window.stargazer_marked.forEach(element => {
    const overlay = document.createElement('div');
    overlay.setAttribute('name', 'stargazer_highlight');

    overlay.style.position = 'absolute';
    overlay.style.zIndex = maximumZIndex;

    overlay.style.border = '1px solid #05F';
    overlay.style.background = 'rgba(0, 85, 255, 0.4)';

    const bounds = element.getBoundingClientRect();
    const documentElement = document.documentElement;

    const topOffset = window.scrollY - documentElement.clientTop;
    const leftOffset = window.scrollX - documentElement.clientLeft;

    overlay.style.top = `${bounds.top + topOffset}px`;
    overlay.style.left = `${bounds.left + leftOffset}px`;

    overlay.style.width = `${bounds.width}px`;
    overlay.style.height = `${bounds.height}px`;

    if (sidebar) {
      sidebar.parentElement.insertBefore(overlay, sidebar);
    } else {
      document.appendChild(overlay);
    }
  });
}

export async function highlightBySelector(selector: string) {
  await markBySelector(selector);
  await executeScript(highlight);
}

export async function removeHighlights() {
  return executeScript(() => {
    const old = document.getElementsByName('stargazer_highlight');
    old.forEach(element => element.remove());
  });
}
