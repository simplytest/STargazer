import { model } from "../../model/messages";

export class meta
{
    public static find_text(element: HTMLElement)
    {
        return element.innerText;
    }

    public static async predict_name(element: HTMLElement)
    {
        const text = this.find_text(element);

        if (!text || text?.length === 0)
        {
            return undefined;
        }

        const type = await model.predict_type(element);

        if (!type || type?.length === 0)
        {
            return undefined;
        }

        return `${text} ${type}`;
    }
}