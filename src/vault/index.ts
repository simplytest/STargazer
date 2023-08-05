import { v4 as uuid } from "uuid";
import { highlighter } from "../client/highlight";
import { storage } from "../extension/storage";

export interface entry_t
{
    id: string;

    name: string;
    description: string;

    image: string;
    selector: string;
}

export interface folder_t
{
    id: string;
    name: string;
    children: entry_t[];
}

export interface vault_t
{
    folders: folder_t[];
}

export class vault
{
    public static async create(name: string)
    {
        const vault = await storage.get<vault_t>("vault") ?? { folders: [] };
        vault.folders.push({ id: uuid(), name, children: [] });

        await storage.set("vault", vault);
    }

    public static async edit(id: string, folder: Partial<folder_t>, overwrite = false)
    {
        const vault = await storage.get<vault_t>("vault") ?? { folders: [] };
        const index = vault.folders.findIndex(x => x.id === id);

        if (index === -1)
        {
            return;
        }

        if (overwrite)
        {
            vault.folders[index] = folder as folder_t;
        }
        else
        {
            vault.folders[index] = { ...vault.folders[index], ...folder };
        }

        await storage.set("vault", vault);
    }

    public static async save(id: string, { selector, name, description }: Partial<entry_t>)
    {
        const vault = await storage.get<vault_t>("vault") ?? { folders: [] };
        const folder = vault.folders.find(x => x.id === id);

        if (!folder)
        {
            return;
        }

        await highlighter.start(selector);

        const screenshot = await chrome.tabs.captureVisibleTab({ format: "jpeg", quality: 60 });
        folder.children.push({ selector, name, description, id: uuid(), image: screenshot });

        await highlighter.stop();

        await storage.set("vault", vault);
    }


    public static async delete(id: string)
    {
        const vault = await storage.get<vault_t>("vault") ?? { folders: [] };

        for (let i = 0; vault.folders.length > i; i++)
        {
            const folder = vault.folders[i];

            if (folder.id === id)
            {
                vault.folders.splice(i, 1);
                break;
            }

            const selector = folder.children.findIndex(x => x.id === id);

            if (selector === -1)
            {
                continue;
            }

            folder.children.splice(selector, 1);
            break;
        }

        await storage.set("vault", vault);
    }
}