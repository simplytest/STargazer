import { picker } from "./client/picker";
import { sidebar } from "./client/sidebar";
import { commands } from "./extension/commands";

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