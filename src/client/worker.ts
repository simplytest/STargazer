import { messages } from "../extension/messages";
import { scripting } from "../extension/scripting";
import { storage } from "../extension/storage";
import { generator, result_t } from "../generator";
import { picker, picking_done } from "./picker";

export class worker
{
    static async update_selectors()
    {
        await scripting.export();

        scripting.execute(() =>
        {
            worker.refresh_selectors();
        });
    }

    static async trigger_generator()
    {
        await scripting.export();

        scripting.execute(() =>
        {
            worker.invoke_generator();
        });
    }

    private static async refresh_selectors()
    {
        const results = await storage.get<result_t[]>("last-results");

        if (!results)
        {
            return;
        }

        const chains = results.map(x => x.chain);
        await storage.set("last-results", await generator.generate(chains, false));
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
