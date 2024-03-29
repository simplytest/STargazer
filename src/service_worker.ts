import { model } from "../model";
import { check_model, request_suffix } from "../model/messages";
import { picker } from "./client/picker";
import { sidebar } from "./client/sidebar";
import { commands } from "./extension/commands";
import { menu } from "./extension/menu";
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

chrome.runtime.onInstalled.addListener(() =>
{
    menu.register("open-vault", "Open Vault", () =>
    {
        const url = chrome.runtime.getURL("pages/vault/index.html");
        chrome.tabs.create({ url });
    });
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
}, true);

messages.register(check_model, async () =>
{
    const instance = await model.get();
    return instance !== null || instance !== undefined;
}, true);

messages.register(request_suffix, async (msg) =>
{
    const instance = await model.get();

    if (!instance)
    {
        return false;
    }

    return instance.suggest_suffix(msg.input);
}, true);