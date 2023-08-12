import theme from "../../shared/theme";
import { scripting } from "../extension/scripting";
import { MAXIMUM_ZINDEX } from "./constants";
import { picker } from "./picker";
import { sidebar } from "./sidebar";

type color_t = string;
type style_t = { background: color_t };

export class highlighter
{
    static readonly ID = "stargazer_highlight";
    static readonly BORDER = 5;

    static async start(selector: string, text = "")
    {
        await scripting.export();

        const style: style_t = {
            background: `${theme.colors.orange[0]}80`,
        };

        await scripting.execute("current", (style, selector, text) =>
        {
            const instance = new highlighter();
            instance.create(style, selector, text);
        },
        style, selector, text);
    }

    static async stop()
    {
        scripting.execute("current", () =>
        {
            highlighter.destroy();
        });
    }

    private create_overlay(style: style_t)
    {
        const overlay = document.createElement("div");
        overlay.setAttribute("name", highlighter.ID);

        overlay.style.position = "absolute";
        overlay.style.zIndex = MAXIMUM_ZINDEX;
        overlay.style.backgroundColor = style.background;
        overlay.style.border = `${highlighter.BORDER}px dotted red`;

        overlay.style.display = "flex";
        overlay.style.color = "#00000060";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";

        return overlay;
    }

    private populate(selector: string, elements: Element[])
    {
        if (selector.startsWith("//"))
        {
            const results = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (let i = 0; results.snapshotLength > i; i++)
            {
                elements.push(results.snapshotItem(i) as Element);
            }

            return;
        }

        [...document.querySelectorAll(selector)].forEach(x => elements.push(x));
    }

    private create(style: style_t, selector: string, text: string)
    {
        // We first delete the old instance

        highlighter.destroy();

        // Then we setup the new instance(s)

        const targets: Element[] = [];

        try
        {
            this.populate(selector, targets);
        }
        catch (e)
        {
            console.debug("[STargazer] Encountered invalid selector while highlighting");
        }

        const sidebar_instance = document.getElementById(sidebar.ID);

        const append = (element) =>
        {
            if (sidebar_instance)
            {
                return document.body.insertBefore(element, sidebar_instance);
            }

            return document.body.appendChild(element);
        };

        for (let i = 0; Math.min(10, targets.length) > i; i++)
        {
            const overlay = this.create_overlay(style);
            overlay.textContent = text;

            picker.position_over(append(overlay), targets[i], highlighter.BORDER);
        }
    }

    public static destroy()
    {
        let instances = document.getElementsByName(highlighter.ID);

        while (instances && instances.length > 0)
        {
            instances[0].remove();
            instances = document.getElementsByName(highlighter.ID);
        }
    }
}