import { picker } from "../client/picker";
import { storage } from "../extension/storage";
import to_css from "./converter/css";
import to_xpath from "./converter/xpath";
import { score } from "./messages";
import { scores } from "./scorer/scores";
import { chain_t, selector_t } from "./selector";
import by_attributes from "./strategy/attribute";
import by_parents from "./strategy/parent";

const transformer = new Map([
    ["css", to_css],
    ["xpath", to_xpath],
]);

const lm_try = (fn: () => number) =>
{
    try
    {
        return fn();
    }
    catch (e)
    {
        return 0;
    }
};

const lookup = new Map([
    ["css", (selector: string) => lm_try(() => document.querySelectorAll(selector).length)],
    ["xpath", (selector: string) => lm_try(() => document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength)],
]);

export interface result_t
{
    chain: chain_t;
    selector: string;

    score: number;
    occurrences: number;
}

class Generator
{
    private filter_similar(results: result_t[])
    {
        const rtn: result_t[] = [];

        const overlap = (current: result_t, other: result_t) =>
        {
            const intersect = (first: selector_t, second: selector_t) =>
            {
                if ("key" in first && "key" in second)
                {
                    if (first.key !== second.key)
                    {
                        return false;
                    }

                    if (first.value !== second.value)
                    {
                        return false;
                    }

                    return true;
                }

                return false;
            };

            return current.chain.some(x => other.chain.some(y => intersect(x, y)));
        };

        const is_bad = (current: result_t, other: result_t) =>
        {
            if (current.occurrences > other.occurrences)
            {
                return true;
            }

            if (current.score < other.score)
            {
                return true;
            }

            if (current.chain.length > other.chain.length)
            {
                return true;
            }

            const current_selector_length = current.chain.map(x => Object.keys(x).length).reduce((sum, x) => sum + x, 0);
            const other_selector_length = other.chain.map(x => Object.keys(x).length).reduce((sum, x) => sum + x, 0);

            if (current_selector_length > other_selector_length)
            {
                return true;
            }

            return false;
        };

        for (const current of results)
        {
            const intersections = rtn.filter(x => overlap(current, x));

            if (intersections.length === 0)
            {
                rtn.push(current);
                continue;
            }

            for (const other of intersections)
            {
                if (is_bad(current, other))
                {
                    current.score = scores.unusable;
                    break;
                }

                if (is_bad(other, current))
                {
                    other.score = scores.unusable;
                }
            }

            rtn.push(current);
        }

        return rtn;
    }

    private async transform(selectors: chain_t[])
    {
        const scored = await score(selectors);

        const type = await storage.get("selector-type") ?? "xpath";
        const transformed = scored.map(x => ({ ...x, selector: transformer.get(type)(x.chain) }));

        const unique = transformed.filter((x, i) => transformed.findIndex(y => y.selector === x.selector) === i);
        const with_occurrences = unique.map(x => ({ ...x, occurrences: lookup.get(type)(x.selector) }));

        const good = with_occurrences.filter(x => !!x.selector && x.occurrences === 1);
        const other = with_occurrences.filter(x => !!x.selector && x.occurrences > 1);

        return [good, other];
    }

    async generate(initial?: chain_t[], regenerate = true): Promise<result_t[]>
    {
        const element = window[picker.INSPECTED_ID];
        const [good, bad] = await this.transform(initial ?? by_attributes(element));

        if (regenerate && (good.length < 3 || good[0]?.score < scores.good))
        {
            const [p_good, p_bad] = await this.transform(await by_parents(element));

            bad.push(...p_bad);
            good.push(...p_good);
        }

        const rtn = good;

        if (rtn.length < 3)
        {
            rtn.push(...bad);
        }

        const filtered = this.filter_similar(rtn);
        return filtered.sort((a, b) => b.score - a.score).sort((a, b) => a.occurrences - b.occurrences);
    }
}

export const generator = new Generator();