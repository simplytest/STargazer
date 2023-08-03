import { selector_t } from "../../../selector";
import { scores } from "../../scores";

export default function (selector: selector_t)
{
    if ("index" in selector)
    {
        return scores.worse;
    }

    return scores.neutral;
}