import { commands } from "./extension/commands";
import { sidebar } from "./client/sidebar";
import { picker } from "./client/picker";

commands.register("start-picking", async () => 
{
    picker.start();
});

commands.register("open-sidebar", async () => 
{
    await sidebar.open();
});

chrome.action.onClicked.addListener(async ()=> 
{
    await sidebar.open();
});