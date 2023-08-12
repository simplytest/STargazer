import { messages } from "../extension/messages";
import { scripting } from "../extension/scripting";
import { session_storage } from "../extension/storage";
import { generator, result_t } from "../generator";
import { picker, picking_done } from "./picker";

export class update_selectors
{
    public selectors: result_t[];

    constructor(selectors: result_t[])
    {
        this.selectors = selectors;
    }
}

export class worker
{
    static async update_selectors(id: number)
    {
        const session_key = `${id}-last-results`;
        const results = await session_storage.get<result_t[]>(session_key);

        if (!results)
        {
            return;
        }

        await scripting.export(id);

        await scripting.execute(id, results =>
        {
            worker.refresh_selectors(results);
        },
        results);
    }

    static async trigger_generator()
    {
        await scripting.export();

        scripting.execute("current", () =>
        {
            worker.invoke_generator();
        });
    }

    private static async refresh_selectors(results: result_t[])
    {
        const chains = results.map(x => x.chain);
        const selectors = await generator.generate(chains, false);

        await messages.send(new update_selectors(selectors));
    }

    private static async invoke_generator()
    {
        if (!window[picker.INSPECTED_ID])
        {
            return;
        }

        generator.generate().then(results => messages.send(new picking_done(results)));
    }
}
