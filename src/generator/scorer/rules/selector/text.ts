import { selector_t } from "../../../selector";
import { scores } from "../../scores";

export default function (selector: selector_t)
{
    if ("text" in selector)
    {
        return scores.worst * Math.max(3, selector.text.length);
    }

    return scores.neutral;
}