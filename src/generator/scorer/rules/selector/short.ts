import { selector_t } from "../../../selector";
import { scores } from "../../scores";

export default function (selector: selector_t)
{
    let score = scores.neutral;

    for (const value of Object.values(selector))
    {
        if (typeof value !== "string")
        {
            continue;
        }

        if (value.length < 20)
        {
            continue;
        }

        score += scores.worst;
    }

    return score;
}