async function execute<T>(script: string): Promise<T> {
  return new Promise<T>(resolve => {
    chrome.devtools.inspectedWindow.eval(script, {}, result => {
      resolve(result as T);
    });
  });
}

export { execute };
