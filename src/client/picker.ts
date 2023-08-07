import theme from "../../shared/theme";
import { messages } from "../extension/messages";
import { scripting } from "../extension/scripting";
import { generator, result_t } from "../generator";
import { MAXIMUM_ZINDEX } from "./constants";
import { highlighter } from "./highlight";
import { meta } from "./meta";
import { sidebar } from "./sidebar";

type color_t = string;
type style_t = { background: color_t };

export class picking_done
{
    public results: result_t[];

    constructor(results: result_t[])
    {
        this.results = results;
    }
}

export class suggest_name
{
    public name: string;

    constructor(name: string)
    {
        this.name = name;
    }
}

export class picker
{
    static readonly INSPECTED_ID = "stargazer_inspected";
    static readonly SIGNAL_ID = "stargazer_abortsignal";
    static readonly ALERT_ID = "stargazer_alert";
    static readonly ID = "stargazer_picker";

    private overlay: HTMLDivElement;
    private last_event: MouseEvent;

    static async start()
    {
        await scripting.export();

        const style: style_t = {
            background: `${theme.colors.blue[0]}80`,
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

    private static is_sticky(element: Element)
    {
        if (!element || element === document.body)
        {
            return false;
        }

        const style = element.computedStyleMap();
        const position = style.get("position").toString();

        if (position.match(/fixed|sticky/i))
        {
            return true;
        }

        return picker.is_sticky(element.parentElement);
    }

    public static position_over(root: HTMLElement, target: Element, border?: number)
    {
        const style = root.style;
        const dim = target.getBoundingClientRect();

        style.width = `${dim.width}px`;
        style.height = `${dim.height}px`;
        style.lineHeight = `${dim.height}px`;

        let { top, left } = dim;

        if (picker.is_sticky(target))
        {
            style.position = "fixed";
        }
        else
        {
            top += window.scrollY;
            left += window.scrollX;
            style.position = "absolute";
        }

        if (border)
        {
            top -= border;
            left -= border;
        }

        style.top = `${top}px`;
        style.left = `${left}px`;
    }

    private static alert(message: string)
    {
        const root = document.createElement("div");
        root.id = picker.ALERT_ID;

        root.style.top = "10vh";
        root.style.position = "fixed";
        root.style.borderRadius = "15px";
        root.style.zIndex = MAXIMUM_ZINDEX;
        root.style.transition = "all 300ms ease";
        root.style.transform = "translate(calc(50vw - 50%), 0)";

        root.style.padding = "10px";
        root.style.background = "#FFFFFF";
        root.style.border = "1px solid #000000";
        root.style.boxShadow = "5px 5px 20px rgba(0, 0, 0, 0.5)";

        root.style.display = "flex";
        root.style.alignItems = "center";
        root.style.justifyContent = "center";

        const text = document.createElement("div");
        text.innerHTML = message;

        root.appendChild(text);
        const alert = document.body.appendChild(root);

        setTimeout(() =>
        {
            alert.remove();
        }, 5000);
    }

    private create_overlay(style: style_t)
    {
        const overlay = document.createElement("div");

        overlay.id = picker.ID;

        overlay.style.cursor = "crosshair";
        overlay.style.position = "absolute";
        overlay.style.transition = "all 300ms ease";

        overlay.style.textAlign = "center";
        overlay.style.verticalAlign = "middle";

        overlay.style.zIndex = MAXIMUM_ZINDEX;
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

        this.overlay.textContent = target.tagName.toLowerCase();

        if (target.id)
        {
            this.overlay.textContent += ` #${target.id}`;
        }

        picker.position_over(this.overlay, target);
        this.last_event = event;
    }

    private mouse_down(event: MouseEvent)
    {
        const under_mouse = document.elementsFromPoint(event.clientX, event.clientY);
        let target: Element = null;

        if (under_mouse[0]?.id === picker.ID)
        {
            target = under_mouse[1];
        }
        else
        {
            target = under_mouse[0];
        }

        if (!target)
        {
            return;
        }

        window[picker.INSPECTED_ID] = target;

        generator.generate().then(results =>
        {
            messages.send(new picking_done(results));
        });

        meta.predict_name(target as HTMLElement).then(name =>
        {
            messages.send(new suggest_name(name));
        });

        picker.destroy();
    }

    private key_down(event: KeyboardEvent)
    {
        /*
            This is a small convenience feature.

            When you press 'Shift' while picking an element,
            all Pointer-Events will be passed through to the
            underlying element - thus allowing you to fully
            interact with them.
            However this will not allow you to simply click
            on the element to pick it, this will then be
            possible by pressing 'P'.
        */

        const { style } = this.overlay;
        const key = event.key.toLowerCase();
        const passthrough = this.overlay.style.pointerEvents === "none";

        if (key === "shift")
        {
            if (!passthrough)
            {
                const message =
                `You have enabled Passthrough-Picking.<br>
                You can toggle this feature by pressing [Shift].<br>
                To pick an element while this mode is activated, simply press [P]`;

                picker.alert(message);
            }

            style.pointerEvents = passthrough ? "all" : "none";
            event.preventDefault();
        }

        if (key === "p" && passthrough)
        {
            this.mouse_down(new MouseEvent("mousedown", this.last_event));
            event.preventDefault();
        }
    }

    private create(style: style_t)
    {
        // We first delete the old instance

        picker.destroy();
        highlighter.destroy();

        // Then we setup the new instance

        const overlay = this.create_overlay(style);
        const sidebar_instance = document.getElementById(sidebar.ID);

        if (sidebar_instance)
        {
            this.overlay = document.body.insertBefore(overlay, sidebar_instance);
        }
        else
        {
            this.overlay = document.body.appendChild(overlay);
        }

        this.overlay.addEventListener("mousedown", e => this.mouse_down(e));

        window[picker.SIGNAL_ID] = new AbortController();
        document.addEventListener("keydown", e => this.key_down(e), { signal: window[picker.SIGNAL_ID].signal });
        document.addEventListener("mousemove", e => this.mouse_move(e), { signal: window[picker.SIGNAL_ID].signal });
    }

    private static destroy()
    {
        const instance = document.getElementById(picker.ID);
        const abort_signal = window[picker.SIGNAL_ID];

        if (instance)
        {
            instance.remove();
        }

        if (abort_signal)
        {
            abort_signal.abort();
        }
    }
}