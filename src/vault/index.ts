import { v4 as uuid } from "uuid";
import { highlighter } from "../client/highlight";
import { storage } from "../extension/storage";
import { name_regex } from "../validation";

export interface entry_t
{
    id: string;

    name: string;
    description: string;

    image?: string;
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
        if (!name.match(name_regex))
        {
            console.error("[Create] Name is invalid");
            return;
        }

        const vault = await storage.get<vault_t>("vault") ?? { folders: [] };
        vault.folders.push({ id: uuid(), name, children: [] });

        await storage.set("vault", vault);
    }

    public static async edit(id: string, type: "folder" | "entry", value: Partial<folder_t> | Partial<entry_t>)
    {
        if (value.name && !value.name.match(name_regex))
        {
            console.error("[Edit] Name is invalid");
            return;
        }

        const vault = await storage.get<vault_t>("vault") ?? { folders: [] };

        if (type === "folder")
        {
            const index = vault.folders.findIndex(x => x.id === id);

            if (index === -1)
            {
                return;
            }

            vault.folders[index] = { ...vault.folders[index], ...value };
        }
        else
        {
            for (const folder of vault.folders)
            {
                const index = folder.children.findIndex(x => x.id === id);

                if (index === -1)
                {
                    continue;
                }

                folder.children[index] = { ...folder.children[index], ...value };
            }
        }

        await storage.set("vault", vault);
    }

    public static async save(id: string, { selector, name, description }: Partial<entry_t>)
    {
        if (!name.match(name_regex))
        {
            console.error("[Save] Name is invalid");
            return;
        }

        const vault = await storage.get<vault_t>("vault") ?? { folders: [] };
        const folder = vault.folders.find(x => x.id === id);

        if (!folder)
        {
            return;
        }

        const rtn = { selector, name, description, id: uuid() };
        folder.children.push(rtn);

        await storage.set("vault", vault);
        return rtn;
    }

    public static async save_with_screenshot(id: string, entry: Partial<entry_t>)
    {
        if (!entry.name.match(name_regex))
        {
            console.error("[Save] Name is invalid");
            return;
        }


        const new_entry = await this.save(id, entry);

        await highlighter.start(entry.selector, "Target Element");
        const screenshot = await chrome.tabs.captureVisibleTab({ format: "jpeg", quality: 60 });
        await highlighter.stop();

        await this.edit(new_entry.id, "entry", { image: screenshot });
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