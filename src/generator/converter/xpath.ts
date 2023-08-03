import { chain_t, selector_t } from "../selector";

export default function to_xpath(chain: chain_t): string | undefined
{
    const escape = (str: string) => str.replaceAll("\"", "\\\"");

    const translate = (select: selector_t) =>
    {
        let rtn = "tag" in select ? select.tag : "*";

        rtn += "[";

        if ("text" in select)
        {
            rtn += `text() = "${escape(select.text)}" and `;
        }

        if ("key" in select)
        {
            switch (select.key)
            {
            case "class":
                rtn += `contains(@${select.key}, "${escape(select.value)}") and `;
                break;
            default:
                rtn += `@${select.key} = "${escape(select.value)}" and `;
                break;
            }
        }

        if (rtn.endsWith(" and "))
        {
            rtn = rtn.substring(0, rtn.length - 5);
        }

        rtn += "]";

        if (rtn.endsWith("[]"))
        {
            rtn = rtn.substring(0, rtn.length - 2);
        }

        if ("index" in select)
        {
            rtn += `[${select.index + 1}]`;
        }

        return rtn;
    };

    return "//" + chain.map(translate).join("/");
}