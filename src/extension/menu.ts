class Menu
{
    register(id: string, title: string, callback: (tab: chrome.tabs.Tab) => Promise<void> | void)
    {
        chrome.contextMenus.create({
            id,
            title,
            contexts: ["all"]
        });

        chrome.contextMenus.onClicked.addListener((info, tab) =>
        {
            if (info.menuItemId !== id)
            {
                return;
            }

            callback(tab);
        });
    }
}

export const menu = new Menu();