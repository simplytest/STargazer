import { LayersModel, Rank, Tensor, loadLayersModel, tensor2d, topk } from "@tensorflow/tfjs";

export class model
{
    private static model?: Promise<model> = undefined;
    private model: LayersModel;

    private constructor()
    {
        // # We initialize through `get`
    }

    static async load()
    {
        const rtn = new model();

        try
        {
            rtn.model = await loadLayersModel(chrome.runtime.getURL("model/model.json"));
        }
        catch (error)
        {
            console.error("[AI-Model] [Load]", error);
            return null;
        }

        return rtn;
    }

    static async get()
    {
        if (model.model === undefined)
        {
            model.model = model.load();
        }

        return model.model;
    }

    suggest_suffix(input: number[])
    {
        try
        {
            const rtn = this.model.predict(tensor2d([input], [1, 250])) as Tensor<Rank>;
            const index: number = topk(rtn).indices.arraySync() as number;
            return index == 0 ? "Button" : "Select";
        }
        catch (error)
        {
            console.error("[AI-Model] [Predict]", error);
            model.model = Promise.resolve(null);
            return false;
        }
    }
}

model.get();