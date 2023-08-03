import { chain_t, join, select, selector_t } from "../selector";

const exclude = [
    /^class$/ig,

    /length/ig,
    /^lang$/ig,
    /^xmlns$/ig,
    /^style$/ig,
    /^width$/ig,
    /^height$/ig,
    /^js[a-z]+/ig,
    /^on[a-z]+/ig,
    /^placeholder$/ig,
    /^autocomplete$/ig,
];

export default function by_attributes(element: HTMLElement): chain_t[]
{
    const rtn: selector_t[] = [];
    const as_chain = () => rtn.map(x => [x]);

    const text = element.textContent;
    const tag = element.tagName.toLowerCase();

    const attributes = element.getAttributeNames();
    const allowed_attributes = attributes.filter(x => !exclude.find(regex => x.match(regex)));

    for (const attribute of allowed_attributes)
    {
        rtn.push(select({ key: attribute, value: element.getAttribute(attribute) }));
        tag && rtn.push(select({ tag, key: attribute, value: element.getAttribute(attribute) }));
    }

    if (attributes.includes("class"))
    {
        const classes = element.getAttribute("class").split(" ");

        for (const clazz of classes)
        {
            rtn.push(select({ key: "class", value: clazz }));
            tag && rtn.push(select({ tag, key: "class", value: clazz }));
        }
    }

    if (!text)
    {
        return as_chain();
    }

    rtn.push(select({ text }));
    tag && rtn.push(select({ tag, text }));

    const items = [...rtn];

    for (const item of items)
    {
        rtn.push(join(item, select({ text })));
    }

    return as_chain();
}