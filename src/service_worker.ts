import { commands } from "./extension/commands";
import { sidebar } from "./sidebar";

commands.register("open-sidebar", async () => 
{
    await sidebar.open();
});

chrome.action.onClicked.addListener(async ()=> 
{
    await sidebar.open();
});