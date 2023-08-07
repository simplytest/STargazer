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
