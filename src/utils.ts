interface InspectedElement {
    html: string;
    node?: Element;
    innerText: string;
};

async function getInspectedElement(): Promise<InspectedElement> {
    const element = await new Promise<InspectedElement>((resolve) => {
        chrome.devtools.inspectedWindow.eval(`[$0.outerHTML, $0.innerText]`, {}, (result) => {
            resolve({ html: result[0], innerText: result[1] })
        });
    });

    const parser = new DOMParser();
    element.node = parser.parseFromString(element.html, "text/html").body.firstElementChild;

    return element;
}

async function getParentOfInspected(): Promise<InspectedElement> {
    const element = await new Promise<InspectedElement>((resolve) => {
        chrome.devtools.inspectedWindow.eval(`[$0.parentElement.outerHTML, $0.parentElement.innerText]`, {}, (result) => {
            resolve({ html: result[0], innerText: result[1] })
        });
    });

    const parser = new DOMParser();
    element.node = parser.parseFromString(element.html, "text/html").body.firstElementChild;

    return element;
}

async function getDom(): Promise<Document> {
    const html = await new Promise<string>((resolve) => {
        chrome.devtools.inspectedWindow.eval(`document.body.outerHTML`, {}, (result) => {
            resolve(result as unknown as string);
        });
    });

    return new DOMParser().parseFromString(html, "text/html");
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
    getParentOfInspected,
    getInspectedElement,
    invokeDebugger,
    getVersion,
    getHotkey,
    getDom,

    InspectedElement
};
