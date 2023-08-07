import { LayersModel, Rank, Tensor, loadLayersModel, tensor2d, topk } from "@tensorflow/tfjs";

class Model
{
    private model: LayersModel;

    constructor()
    {
        loadLayersModel(chrome.runtime.getURL("model/model.json")).then(model => this.model = model);
    }

    suggest_suffix(input: number[])
    {
        if (!this.model)
        {
            return null;
        }

        const rtn = this.model.predict(tensor2d([input], [1, 250])) as Tensor<Rank>;
        const index: number = topk(rtn).indices.arraySync() as number;
        return index == 0 ? "Button" : "Select";
    }
}

export const model = new Model();