import { scripting } from "../extension/scripting";
import { storage } from "../extension/storage";
import { generator, result_t } from "../generator";

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
}
