function startPicking() {
  const old = document.getElementById('indiana_inspect');
  const maximumZIndex = '2147483647';

  if (old) {
    old.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'indiana_inspect';

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
    window['indiana_inspected'] = document.elementFromPoint(clientX, clientY);

    chrome.runtime.sendMessage(null, { name: 'Selected' });
    overlay.remove();
  };

  const sidebar = document.getElementById('indiana_sidebar');

  if (sidebar) {
    sidebar.parentElement.insertBefore(overlay, sidebar);
  } else {
    document.appendChild(overlay);
  }

  document.addEventListener('mousemove', e => {
    const { target, clientX, clientY } = e;
    const id: string = 'id' in target ? (target.id as string) : '';

    const overSelf = id.includes('indiana_');

    if (overSelf) {
      overlay.style.display = 'none';
    }

    const element = document.elementFromPoint(clientX, clientY);
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

function stopPicking() {
  const inspect = document.getElementById('indiana_inspect');

  if (!inspect) {
    return;
  }

  inspect.remove();
}

export { startPicking, stopPicking };
