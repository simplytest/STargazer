import { chain_t, selector_t } from "../../../selector";
import { scores } from "../../scores";

export default function (chain: chain_t)
{
    const is_bad = (value: selector_t) => Object.keys(value).length === 1 && "tag" in value;
    return chain.map(x => is_bad(x) ? scores.worst : scores.neutral).reduce((sum, x) => sum + x, 0);
}