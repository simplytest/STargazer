export class Listener<T>
{
    private listener: (changes: {[key: string]: chrome.storage.StorageChange;}) => void;

    constructor(key: string, callback: (value: T) => void)
    {
        this.listener = (changes: {[key: string]: chrome.storage.StorageChange}) => 
        {
            if (!changes[key])
            {
                return;
            }

            callback(changes[key].newValue);
        };

        chrome.storage.local.onChanged.addListener(this.listener);
    }

    public destroy()
    {
        chrome.storage.local.onChanged.removeListener(this.listener);
    }
}

class Storage
{
    async get<T = string>(key: string)
    {
        const result = await chrome.storage.local.get(key); 
        return result[key] as T;
    }

    async set<T = string>(key: string, value: T)
    {
        return await chrome.storage.local.set({ [key]: value });
    }

    watch<T = string>(key: string, callback: (new_value: T) => void)
    {
        return new Listener<T>(key, callback); 
    }
}

export const storage = new Storage();