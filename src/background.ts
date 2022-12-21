import { invokeDebugger } from "./utils";

chrome.commands.onCommand.addListener(async (command) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id, allFrames: true },
        func: invokeDebugger,
        world: "MAIN",
    });
});