function name_of<T>(obj: T): string
{
    if (typeof obj === "function" && "name" in obj)
    {
        return obj.name as string;
    }

    if (typeof obj === "object" && "constructor" in obj)
    {
        return obj.constructor.name;
    }

    return typeof obj;
}

interface message<T>
{
    message: T;
    id: string;
}

class Messages
{
    /*
    # Why is there no proper function overloading in Type/Java-Script (╯°□°)╯︵ ┻━┻?!
    # Anyways, this looks kind-of ugly - because of that.
    */

    async send<T, Result>(message: T, type: any = message, id = name_of(type)): Promise<Result>
    {
        return new Promise<Result>((resolve) =>
        {
            chrome.runtime.sendMessage({ message, id } as message<T>, response =>
            {
                resolve(response);
            });
        });
    }

    async register<T, A extends Array<any>>(type: new(...args: A) => T, callback: (message: T, sender: chrome.runtime.MessageSender) => any, id = name_of(type))
    {
        chrome.runtime.onMessage.addListener((message: message<T>, sender, respond) =>
        {
            if (message.id !== id)
            {
                return true;
            }

            const response = callback(message.message, sender);

            if (response instanceof Promise)
            {
                response.then(respond);
            }
            else
            {
                respond(response);
            }

            return true;
        });
    }
}

export const messages = new Messages();