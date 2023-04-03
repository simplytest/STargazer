import { removeHighlights } from './highlight';
import { startPicking, stopPicking } from './picker';
import { isSidebarActive, loadSidebar } from './sidebar';

chrome.commands.onCommand.addListener(async command => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (command === 'pause-execution') {
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0]?.id, allFrames: true },
      func: () => eval('debugger'),
      world: 'MAIN',
    });
  }

  if (command === 'start-picking') {
    await startPicking();

    try {
      await chrome.runtime.sendMessage(null, { name: 'start-picking' });
    } catch (e) {
      /**/
    }
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onDisconnect.addListener(() => removeHighlights());
});

chrome.runtime.onMessage.addListener(message => {
  if (message?.name !== 'Selected') {
    return false;
  }

  isSidebarActive().then(active => {
    if (active) {
      return;
    }

    loadSidebar();
    stopPicking();
  });

  return false;
});
