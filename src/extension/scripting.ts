class Scripting
{
    async execute<Result, Args extends Array<any>>(func: (...args: Args) => Result, ...args: Args)
    {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0]?.id;

        return new Promise((resolve, reject) =>
        {
            chrome.scripting.executeScript<Args[], Result>({
                target: { tabId: tab },
                args  : [...args],
                func  : func,
            }, results =>
            {
                if (!Array.isArray(results))
                {
                    reject(chrome.runtime.lastError.message);
                }

                resolve(results.at(0).result);
            });
        });
    }

    async export()
    {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0]?.id;

        return new Promise<void>((resolve, reject) =>
        {
            chrome.scripting.executeScript({
                target           : { tabId: tab },
                injectImmediately: true,
                files            : ["/src/client/export.js"]
            }, results =>
            {
                if (!Array.isArray(results))
                {
                    reject(chrome.runtime.lastError.message);
                }

                resolve();
            });
        });
    }

    async execute_devtools<Result>(script: string)
    {
        return new Promise((resolve, reject) =>
        {
            chrome.devtools.inspectedWindow.eval(script, {}, (result, error) =>
            {
                if (error.isError || error.isException)
                {
                    reject(error.description);
                }

                resolve(result as Result);
            });
        });
    }

    has_devtools()
    {
        return !!chrome?.devtools?.inspectedWindow;
    }
}

export const scripting = new Scripting();
