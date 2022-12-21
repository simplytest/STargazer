async function getInspectedElement(): Promise<string> {
    return new Promise<string>((resolve) => {
        chrome.devtools.inspectedWindow.eval(`$0.outerHTML`, {}, (result) => {
            resolve(result as unknown as string);
        });
    });
}

async function getDom(): Promise<string> {
    return new Promise<string>((resolve) => {
        chrome.devtools.inspectedWindow.eval(`document.body.outerHTML`, {}, (result) => {
            resolve(result as unknown as string);
        });
    });
}

async function getHotkey(): Promise<string> {
    const commands = await chrome.commands.getAll();
    const trigger = commands.find((x) => x.name === "run-indiana")!;

    return trigger.shortcut;

}

function getVersion(): string {
    return chrome.runtime.getManifest().version;
}

function invokeDebugger() {
    eval('debugger');
}

export {
    getInspectedElement,
    invokeDebugger,
    getVersion,
    getHotkey,
    getDom,
};
