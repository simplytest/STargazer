import { chain_t, join, select, selector_t } from "../selector";

const exclude = [
    /^class$/ig,
    /^src(set)?$/ig,

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

    const src_attributes = attributes.filter(x => x.match(exclude[1]));

    for (const attribute of src_attributes)
    {
        const src = element.getAttribute(attribute);
        const file = src.substring(src.lastIndexOf("/") + 1);

        if (file.length > 0)
        {
            rtn.push(select({ key: attribute, value: file, contains: true }));
            tag && rtn.push(select({ tag, key: attribute, value: file, contains: true }));
        }

        rtn.push(select({ key: attribute, value: src }));
        tag && rtn.push(select({ tag, key: attribute, value: src }));
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