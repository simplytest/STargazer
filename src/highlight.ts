import { exec } from './utils/chrome';
import { markBySelector } from './utils/dom';

function highlight() {
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
      document.body.appendChild(overlay);
    }
  });
}

export async function highlightBySelector(selector: string) {
  await removeHighlights();
  await markBySelector(selector);
  await exec(highlight);
}

export async function removeHighlights() {
  return exec(() => {
    let old = document.getElementsByName('stargazer_highlight');

    // Stupid workaround for elements not being properly removed.
    while (old.length > 0) {
      old.forEach(x => x.remove());
      old = document.getElementsByName('stargazer_highlight');
    }
  });
}
