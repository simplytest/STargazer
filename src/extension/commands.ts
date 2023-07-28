import manifest from "../../manifest.json";

type manifest_t = typeof manifest;

class Commands
{
    register(command: keyof manifest_t["commands"], callback: (tab: chrome.tabs.Tab) => Promise<void> | void)
    {
        chrome.commands.onCommand.addListener((cmd, tab) =>
        {
            if (cmd !== command)
            {
                return;
            }

            callback(tab);
        });
    }
}

export const commands = new Commands();