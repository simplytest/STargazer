class Notifications
{
    show(title: string, message: string, priority = 0)
    {
        chrome.notifications.create({
            type   : "basic",
            iconUrl: "/assets/logo.png",
            title,
            message,
            priority
        });
    }
}

export const notifications = new Notifications();