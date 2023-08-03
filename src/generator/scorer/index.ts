import { chain_t } from "../selector";
import short from "./rules/chain/short";
import tag from "./rules/chain/tag";
import sel_tag from "./rules/selector/tag";
import attributes from "./rules/selector/attributes";
import empty from "./rules/selector/empty";
import indices from "./rules/selector/indices";
import text from "./rules/selector/text";
import words from "./rules/selector/words";

export function score(chain: chain_t)
{
    const score = <T, R extends Array<(value: T, i?: number) => number>>(rules: R, value: T) =>
    {
        return rules.map((rule, index) => rule(value, index)).reduce((sum, x) => sum + x, 0);
    };

    const chain_rules = [short, tag];
    const chain_score = score(chain_rules, chain);

    const selector_rules = [attributes, empty, indices, words, text, sel_tag];
    const selector_scores = chain.map(selector => score(selector_rules, selector)).reduce((sum, x) => sum + x, 0);

    return chain_score + selector_scores;
}