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

export async function score(chains: chain_t[])
{
    const scores: {score: number, chain: chain_t}[] = await messages.send(new request_score(chains));

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