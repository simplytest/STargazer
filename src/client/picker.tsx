import theme from "../../shared/theme";
import { scripting } from "../extension/scripting";

type color_t = string;
type style_t = { background: color_t };

export class picker
{
    static readonly MAXIMUM_ZINDEX = "2147483647";
    static readonly ID = "stargazer_picker";

    private overlay: HTMLDivElement;

    static async start() 
    {
        await scripting.export();

        const style: style_t = {
            background: `${theme.colors.green[0]}80`,
        };

        await scripting.execute(style => 
        {
            const instance = new picker();
            instance.create(style);
        }, 
        style);
    }

    static async stop() 
    {
        scripting.execute(() => 
        {
            picker.destroy();
        });
    }

    private create_overlay(style: style_t)
    {
        const overlay  = document.createElement("div");
        
        overlay.id = picker.ID;
        
        overlay.style.position = "absolute";
        overlay.style.transition = "all 300ms ease";

        overlay.style.textAlign = "center";
        overlay.style.verticalAlign = "middle";
        
        overlay.style.zIndex = picker.MAXIMUM_ZINDEX;
        overlay.style.backgroundColor = style.background;

        return overlay;
    }

    private mouse_move(event: MouseEvent)
    {
        let target = event.target as Element;
        const over_self = target?.id === picker.ID;

        const under_mouse = document.elementsFromPoint(event.clientX, event.clientY);
        target = under_mouse[over_self ? 1 : 0];

        if (!target)
        {
            return;
        }

        const dim = target.getBoundingClientRect();

        this.overlay.textContent = target.tagName.toLowerCase();

        if (target.id)
        {
            this.overlay.textContent += ` #${target.id}`;
        }

        this.overlay.style.width = `${dim.width}px`;
        this.overlay.style.height = `${dim.height}px`;
        this.overlay.style.lineHeight = `${dim.height}px`;

        this.overlay.style.top = `${dim.top + window.scrollY}px`;
        this.overlay.style.left = `${dim.left + window.scrollX}px`;
    }

    private create(style: style_t)
    {
        // We first delete the old instance

        picker.destroy();        

        // Then we setup the new instance
        
        const overlay = this.create_overlay(style);
        this.overlay = document.body.appendChild(overlay);

        document.addEventListener("mousemove", e => this.mouse_move(e));
    }

    private static destroy()
    {
        const instance = document.getElementById(picker.ID);

        if (!instance) 
        {
            return;
        }

        instance.remove();
    }
}