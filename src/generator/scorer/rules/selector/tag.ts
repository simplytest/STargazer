import { selector_t } from "../../../selector";
import { scores } from "../../scores";

export default function (selector: selector_t)
{
    if ("tag" in selector && Object.keys(selector).length === 1)
    {
        return scores.worst;
    }

    return scores.neutral;
}