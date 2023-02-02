async function execute<T>(script: string): Promise<T> {
  return new Promise<T>(resolve => {
    chrome.devtools.inspectedWindow.eval(script, {}, result => {
      resolve(result as T);
    });
  });
}

async function inject<R, T extends unknown[]>(func: (...args: T) => R, ...args: T): Promise<R> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0].id;

  return new Promise<R>(resolve => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab },
        args: [...args],
        func: func,
      },
      results => resolve(results[0].result)
    );
  });
}

export { execute, inject };
