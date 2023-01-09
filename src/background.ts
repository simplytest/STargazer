chrome.commands.onCommand.addListener(async command => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (command === 'pause-execution') {
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id, allFrames: true },
      func: () => eval('debugger'),
      world: 'MAIN',
    });
  }
});
