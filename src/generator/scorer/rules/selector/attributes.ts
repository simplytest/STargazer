import { selector_t } from "../../../selector";
import { scores } from "../../scores";

export default function (selector: selector_t)
{
    if (!("key" in selector))
    {
        return scores.neutral;
    }

    const score_table = [
        {
            score  : scores.best,
            matches: [/^id$/ig, /^data.+$/ig],
        },
        {
            score  : scores.bad,
            matches: [/^name$/ig],
        },
        {
            score  : scores.worst,
            matches: [/^src(set)?$/ig, /^href$/ig, /^target$/ig, /^alt$/ig, /^title$/ig, /^placeholder$/ig],
        },
    ];

    return score_table.find(({ matches }) => matches.some(regex => selector.key.match(regex)))?.score ?? scores.neutral;
}