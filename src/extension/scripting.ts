class Scripting
{
    async can_access()
    {
        let rtn = false;

        try
        {
            await this.execute("current", () =>
            {

            });

            rtn = true;
        }
        catch (error)
        {
            rtn = false;
        }

        return rtn;
    }

    async execute<Result, Args extends Array<any>>(tab: "current" | number, func: (...args: Args) => Result, ...args: Args)
    {
        const tabs = await chrome.tabs?.query({ active: true, currentWindow: true });
        const tab_id = tab === "current" ? tabs?.[0]?.id : tab;

        return new Promise((resolve, reject) =>
        {
            chrome.scripting.executeScript<Args[], Result>({
                target: { tabId: tab_id },
                args  : [...args],
                func  : func,
            }, results =>
            {
                if (!results || !Array.isArray(results))
                {
                    reject(chrome.runtime.lastError.message);
                }

                resolve(results.at(0).result);
            });
        });
    }

    async export(tab: "current" | number = "current")
    {
        const tabs = await chrome.tabs?.query({ active: true, currentWindow: true });
        const tab_id = tab === "current" ? tabs?.[0]?.id : tab;

        return new Promise<void>((resolve, reject) =>
        {
            chrome.scripting.executeScript({
                target           : { tabId: tab_id },
                injectImmediately: true,
                files            : ["/src/client/export.js"]
            }, results =>
            {
                if (!results || !Array.isArray(results))
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
            chrome.devtools.inspectedWindow.eval(script, { useContentScriptContext: true }, (result, error) =>
            {
                if (error && (error.isError || error.isException))
                {
                    reject(error.description);
                }

                resolve(result as Result);
            });
        });
    }
}

export const scripting = new Scripting();
