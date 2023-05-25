export async function evalScript<T>(script: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(script, {}, (result, error) => {
      if (error && error.isError) {
        reject(error.value);
      }
      resolve(result as T);
    });
  });
}

export async function executeScript<R, T extends Array<any>>(func: (...args: T) => R, ...args: T): Promise<R> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0]?.id;

  return new Promise<R>((resolve, reject) => {
    chrome.scripting.executeScript<T[], R>(
      {
        target: { tabId: tab },
        args: [...args],
        func: func,
      },
      results => (results ? resolve(results.at(0).result as R) : reject(chrome.runtime['lastError'].message))
    );
  });
}

export async function exec<R, T extends Array<any>>(func: (...args: T) => R, ...args: T): Promise<R> {
  const hasDevTools = !!chrome?.devtools?.inspectedWindow;

  if (!hasDevTools) {
    return executeScript(func, ...args);
  }

  const serializedFunc = func
    .toString()
    .replace('async', '')
    .replaceAll(/window.stargazer_inspected/gi, '$0');

  return evalScript<R>(`(${serializedFunc})(...JSON.parse(${JSON.stringify(JSON.stringify(args))}))`);
}

export async function getHotkey(): Promise<string> {
  const commands = await chrome.commands.getAll();
  return commands.find(x => x.name === 'start-picking').shortcut;
}

export function getVersion(): string {
  return chrome.runtime.getManifest().version;
}
