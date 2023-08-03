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

        const intersection = (a: result_t, b: result_t) =>
        {
            const has_intersection = (a: selector_t, b: selector_t) =>
            {
                const a_entires = Object.entries(a);
                const b_entires = Object.entries(b);

                for (const entry of a_entires)
                {
                    if (entry[0] === "tag")
                    {
                        continue;
                    }

                    for (const other of b_entires)
                    {
                        if (JSON.stringify(entry) !== JSON.stringify(other))
                        {
                            continue;
                        }

                        return true;
                    }
                }

                return false;
            };

            for (const selector of a.chain)
            {
                for (const other of b.chain)
                {
                    if (!has_intersection(selector, other))
                    {
                        continue;
                    }

                    return true;
                }
            }

            return false;
        };

        for (const current of results)
        {
            const existing = rtn.find(x => intersection(x, current));

            if (!existing)
            {
                rtn.push(current);
                continue;
            }

            if (existing.score > current.score)
            {
                rtn.push(current);
                continue;
            }

            if (existing.occurrences < current.occurrences)
            {
                continue;
            }

            const existing_len = existing.chain.map(x => Object.keys(x).length).reduce((sum, x) => sum + x, 0);
            const current_len = current.chain.map(x => Object.keys(x).length).reduce((sum, x) => sum + x, 0);

            if (existing.chain.length > current.chain.length || existing_len > current_len)
            {
                existing.score = scores.unusable;
            }

            rtn.push(current);
        }

        return rtn;
    }

    private async transform(selectors: chain_t[])
    {
        const scored = await score(selectors);

        const type = await storage.get("selector-type");
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