import { chain_t, select } from "../selector";

function index_of(parent: HTMLElement, child: HTMLElement)
{
    const children = [...parent.children].filter(x => x.tagName === child.tagName);
    return children.indexOf(child);
}

export default function by_absolute(element: HTMLElement): chain_t[]
{
    const rtn: chain_t = [];

    let current = element;
    let parent = element.parentElement;

    while (current != document.body)
    {
        const tag = current.tagName.toLowerCase();
        rtn.push(select({ tag, index: index_of(parent, current) }));

        current = parent;
        parent = parent.parentElement;
    }

    return [rtn.reverse()];
}