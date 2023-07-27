function name_of<T>(obj: T): string
{
    if (typeof obj === "object" && "name" in obj)
    {
        return obj.name as string;
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
            chrome.runtime.sendMessage({message, id} as message<T>, response => 
            {
                resolve(response);
            });
        });
    }

    async register<T>(type: T, callback: (message: T, sender: chrome.runtime.MessageSender) => any, id = name_of(type))
    {
        chrome.runtime.onMessage.addListener((message: message<any>, sender, respond) => 
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