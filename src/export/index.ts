import { folder_t } from "../vault";

export type framework_t = "selenium" | "playwright";

export interface options_t
{
    folder: folder_t;
    framework: framework_t;
}

export function escape(str: string)
{
    return str.replaceAll("\"", "\\\"");
}

export function sanitize(options: options_t)
{
    const sanitize = (str: string) => str.replaceAll(/[^a-zA-Z0-9_]/g, "_");

    const rtn: options_t = JSON.parse(JSON.stringify(options));
    const { name, children } = rtn.folder;

    rtn.folder.name = sanitize(name);
    const existing = [];

    for (const child of children)
    {
        let sanitized = sanitize(child.name);

        const original = sanitized;
        let num = 0;

        while (existing.includes(sanitized))
        {
            sanitized = `${original}_${num++}`;
        }

        child.name = sanitized;
        existing.push(sanitized);
    }

    return rtn;
}

export function format(code: string)
{
    const indent = (n: number) => " ".repeat(n * 2);
    const lines = code.split("\n");

    let rtn = "";
    let level = 0;

    for (const line of lines)
    {
        const trimmed = line.trim();

        if (trimmed.endsWith("}") || trimmed.startsWith("}"))
        {
            level -= 1;
        }

        rtn += `${indent(level)}${trimmed}\n`;

        if (trimmed.endsWith("{") || trimmed.startsWith("{"))
        {
            level += 1;
        }
    }

    return rtn;
}
