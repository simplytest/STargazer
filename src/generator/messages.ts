import { messages } from "../extension/messages";
import { chain_t } from "./selector";

export class request_score
{
    public chains: chain_t[];

    constructor(chains: chain_t[])
    {
        this.chains = chains;
    }
}

export class failed_to_score
{
}

export async function score(chains: chain_t[])
{
    let scores: {score: number, chain: chain_t}[];

    try
    {
        scores = await messages.send(new request_score(chains));
    }
    catch (e)
    {
        messages.send(failed_to_score);
    }

    /*
    # When stringified, "-Infinity" becomes "null".
    # Thus we restore it here.
    */

    for (const item of scores)
    {
        if (item.score !== null)
        {
            continue;
        }

        item.score = -Infinity;
    }

    return scores;
}