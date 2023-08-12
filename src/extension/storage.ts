type storage_type_t = "local" | "session";

export class Listener<T>
{
    private storage_type: storage_type_t;
    private listener: (changes: {[key: string]: chrome.storage.StorageChange;}) => void;

    constructor(key: string, callback: (value: T) => void, type: storage_type_t = "local")
    {
        this.storage_type = type;

        this.listener = (changes: {[key: string]: chrome.storage.StorageChange}) =>
        {
            if (!changes[key])
            {
                return;
            }

            callback(changes[key].newValue);
        };

        chrome.storage[this.storage_type].onChanged.addListener(this.listener);
    }

    public destroy()
    {
        chrome.storage[this.storage_type].onChanged.removeListener(this.listener);
    }
}

class Storage
{
    private storage_type: storage_type_t;

    constructor(type: storage_type_t = "local")
    {
        this.storage_type = type;
    }

    async get<T = string>(key: string)
    {
        const result = await chrome.storage[this.storage_type].get(key);
        return result[key] as T;
    }

    async set<T = string>(key: string, value: T)
    {
        return await chrome.storage[this.storage_type].set({ [key]: value });
    }

    watch<T = string>(key: string, callback: (new_value: T) => void)
    {
        return new Listener<T>(key, callback, this.storage_type);
    }
}

export const storage = new Storage("local");
export const session_storage = new Storage("session");