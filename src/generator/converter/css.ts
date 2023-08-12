import { chain_t, selector_t } from "../selector";

export default function to_css(chain: chain_t): string | undefined
{
    if (chain.find(x => "text" in x))
    {
        return undefined;
    }

    const translate = (select: selector_t) =>
    {
        let rtn = "";

        if ("tag" in select)
        {
            rtn += select.tag;
        }

        if ("key" in select)
        {
            switch (select.key)
            {
            case "id":
                rtn += `#${select.value}`;
                break;
            case "class":
                rtn += `.${select.value}`;
                break;
            default:
                if (select.contains)
                {
                    rtn += `[${select.key}*="${select.value.replaceAll("\"", "\\\"")}"]`;
                }
                else
                {
                    rtn += `[${select.key}="${select.value.replaceAll("\"", "\\\"")}"]`;
                }
                break;
            }
        }

        if ("index" in select)
        {
            rtn += `:nth-child(${select.index + 1})`;
        }

        return rtn;
    };

    return chain.map(translate).join(" ");
}