import { messages } from "../src/extension/messages";
import dict from "./dict.json";

export class request_suffix
{
    input: number[];

    constructor(input: number[])
    {
        this.input = input;
    }
}

export class model_available
{
}

const allowed_attributes = [
    "class",
    "type",
    "name",
    "role",
    "id",
];

export class model
{
    public static async predict_type(element: HTMLElement): Promise<string>
    {
        let input = `${element.tagName.toLowerCase()}`;

        for (const attribute of element.getAttributeNames())
        {
            if (!allowed_attributes.includes(attribute))
            {
                continue;
            }

            input += ` ${attribute}="${element.getAttribute(attribute)}"`;
        }

        input = input.toLowerCase();
        input = input.replaceAll(/[=]/g, " ").replaceAll(/["]/g, "");

        const split = input.split(" ");
        const tokens = [];

        for (const char of split)
        {
            if (dict[char] === undefined)
            {
                continue;
            }

            tokens.push(dict[char]);
        }

        while (tokens.length < 250)
        {
            tokens.push(0);
        }

        return await messages.send(new request_suffix(tokens));
    }

    public static async available(): Promise<boolean>
    {
        return await messages.send(model_available);
    }
}