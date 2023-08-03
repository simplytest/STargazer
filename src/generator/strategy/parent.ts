import { score } from "../messages";
import { chain_t, join, select } from "../selector";
import by_attributes from "./attribute";

/*
# This function also includes the element itself.
*/
function parents_of(element: HTMLElement, rtn: HTMLElement[] = [])
{
    if (!element || element === document.body)
    {
        return rtn;
    }

    rtn.push(element);
    return parents_of(element.parentElement, rtn);
}

function index_of(parent: Element, element: Element)
{
    return [...parent.children].indexOf(element);
}

const TOP_N = 15;
const MAX_DEPTH = 5;

async function build_recursive(parents: HTMLElement[], rtn: Map<number, chain_t[]>, index = 1)
{
    if (index >= parents.length)
    {
        return;
    }

    const results = [];
    const element = parents.at(index);
    const child = parents.at(index - 1);

    const tag = element.tagName.toLowerCase();
    const child_index = index_of(element, child);
    const child_tag = child.tagName.toLowerCase();

    const previous = rtn.get(index - 1);
    const current = by_attributes(element);

    current.push([select({ tag })]);
    previous.push([select({ index: child_index })]);
    previous.push([select({ tag: child_tag, index: child_index })]);

    for (const selector of current)
    {
        for (const other of previous)
        {
            const last = other.at(other.length - 1);
            const remaining = other.slice(0, other.length - 1);

            results.push([...selector, ...remaining, last]);
            results.push([...selector, ...remaining, select({ index: child_index })]);
            results.push([...selector, ...remaining, join(last, select({ index: child_index }))]);
        }
    }

    const scored = await score(results);
    const sorted = scored.sort((a, b) => b.score - a.score);

    const top = sorted.slice(0, TOP_N);
    rtn.set(index, top.map(x => x.chain));

    await build_recursive(parents, rtn, index + 1);
}

export default async function by_parents(element: HTMLElement)
{
    const parents = parents_of(element).slice(0, MAX_DEPTH);
    const results = new Map<number, chain_t[]>();
    results.set(0, by_attributes(element));

    await build_recursive(parents, results);
    const all_layers = [];

    for (const [index, layer] of results)
    {
        if (index === 0)
        {
            continue;
        }

        const unique = layer.filter((x, i) => layer.findIndex(y => JSON.stringify(y) === JSON.stringify(x)) === i);
        all_layers.push(...unique);
    }

    return all_layers;
}