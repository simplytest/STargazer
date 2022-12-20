function triggerDebugger() {
    eval('debugger');
}

chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true },
            func: triggerDebugger,
            world: "MAIN",
        });
    });
});