import { selector_t } from "../../../selector";
import { scores } from "../../scores";

export default function (selector: selector_t)
{
    if (!("key" in selector))
    {
        return scores.neutral;
    }

    if (!selector.key.match(/^src(set)?$/ig))
    {
        return scores.neutral;
    }

    if (selector.contains)
    {
        return scores.neutral;
    }

    return scores.worse;
}