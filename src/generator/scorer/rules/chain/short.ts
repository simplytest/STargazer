import { chain_t } from "../../../selector";
import { scores } from "../../scores";

export default function (chain: chain_t)
{
    if (chain.length === 1)
    {
        return scores.better;
    }

    return Math.pow(2, chain.length) * scores.worse;
}