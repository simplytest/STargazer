import { selector_t } from "../../../selector";
import { scores } from "../../scores";

export default function (selector: selector_t)
{
    if (("key" in selector) && (!selector.key || !selector.value))
    {
        return scores.unusable;
    }

    return scores.neutral;
}