async function getHotkey(): Promise<string> {
  const commands = await chrome.commands.getAll();
  return commands.find(x => x.name === 'pause-execution').shortcut || '<No Hotkey set>';
}

function getVersion(): string {
  return chrome.runtime.getManifest().version;
}

export { getHotkey, getVersion };
