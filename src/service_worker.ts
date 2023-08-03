import { picker } from "./client/picker";
import { sidebar } from "./client/sidebar";
import { commands } from "./extension/commands";
import { messages } from "./extension/messages";
import { request_score } from "./generator/messages";
import { score } from "./generator/scorer";

commands.register("start-picking", async () =>
{
    picker.start();
});

commands.register("open-sidebar", async () =>
{
    await sidebar.open();
});

chrome.action.onClicked.addListener(async () =>
{
    await sidebar.open();
});

/*
# We handle selector scoring in the background script because it allows us
# to reduce the loading time of the sidebar.
*/

messages.register(request_score, msg =>
{
    return msg.chains.map(x => ({ score: score(x), chain: x }));
});