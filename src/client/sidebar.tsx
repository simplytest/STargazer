import theme from "../../shared/theme";
import { scripting } from "../extension/scripting";

import { IconArrowsMove } from "@tabler/icons-react";
import { renderToString } from "react-dom/server";
import { Listener, storage } from "../extension/storage";
import { MAXIMUM_ZINDEX } from "./constants";

type html_t = string;
type color_t = string;
type style_t = { background: color_t; handle: color_t; icon: html_t };

export class sidebar 
{
    static readonly LISTENER_ID = "stargazer_sidebar_listener";
    static readonly HANDLE_ID = "stargazer_sidebar_handle";
    static readonly ID = "stargazer_sidebar";

    private root: HTMLDivElement;
    private initial_pos = [0, 0];
    private move = false;

    static async open() 
    {
        const url = chrome.runtime.getURL("pages/sidebar/index.html");
        const icon = renderToString(<IconArrowsMove color="gray" />);

        const style: style_t = {
            background: await sidebar.background(),
            handle: await  sidebar.color(),
            icon,
        };

        await scripting.export();

        await scripting.execute(async (url: string, style: style_t) => 
        {
            const instance = new sidebar();
            instance.create(url, style);
        }, 
        url, style);
    }

    static async close() 
    {
        scripting.execute(() => 
        {
            sidebar.destroy();
        });
    }

    static is_open() 
    {
        return scripting.execute(() => 
        {
            !!document.getElementById(sidebar.ID);
        });
    }

    static async background()
    {
        const variant = await storage.get("theme") || "light";

        if (variant === "light")
        {
            return theme.colors.gray[7];
        }

        return theme.colors.dark[4];
    }

    static async color()
    {
        const variant = await storage.get("theme") || "light";
        return theme.colors[variant === "dark" ? "dark" : "gray"][4];
    }

    private static destroy() 
    {
        const instance = document.getElementById(sidebar.ID);
        const listener: Listener<string> = window[sidebar.LISTENER_ID];

        if (instance) 
        {
            instance.remove();
        }

        if (listener)
        {
            listener.destroy();
        }
    }

    private static create_root(style: style_t) 
    {
        const root = document.createElement("div");

        root.style.zIndex = MAXIMUM_ZINDEX;
        root.style.overflow = "hidden";
        root.id = sidebar.ID;

        root.style.border = `1px solid ${style.background}`;
        root.style.background = style.background;

        root.style.flexDirection = "column";
        root.style.display = "flex";

        root.style.position = "fixed";
        root.style.right = "0px";
        root.style.top = "0px";

        root.style.width = "400px";
        root.style.height = "85vh";

        return root;
    }

    private static create_handle(style: style_t) 
    {
        const handle = document.createElement("div");
        
        handle.style.background = style.handle;
        handle.id = sidebar.HANDLE_ID;
        handle.style.cursor = "move";

        handle.style.height = "30px";
        handle.style.width = "100%";

        const icon = document.createElement("div");
        icon.innerHTML = style.icon;

        const svg = icon.firstChild as SVGElement;

        svg.style.position = "relative";
        svg.style.display = "block";
        svg.style.margin = "auto";
        svg.style.top = "2px";

        handle.appendChild(icon);

        return handle;
    }

    private static create_iframe(url: string) 
    {
        const iframe = document.createElement("iframe");

        iframe.style.border = "none";
        iframe.style.flexGrow = "1";

        iframe.style.padding ="0";
        iframe.style.margin = "0";

        iframe.src = url;

        return iframe;
    }

    private mouse_move(ev: MouseEvent) 
    {
        if (!this.move) 
        {
            return;
        }

        ev.preventDefault();

        const { clientX, clientY } = ev;
        const [initialX, initialY] = this.initial_pos;

        const diffX = initialX - clientX;
        const diffY = initialY - clientY;

        this.initial_pos = [clientX, clientY];

        this.root.style.top = `${this.root.offsetTop - diffY}px`;
        this.root.style.left = `${this.root.offsetLeft - diffX}px`;
    }

    private drag_start(ev: MouseEvent) 
    {
        ev.preventDefault();

        this.initial_pos = [ev.clientX, ev.clientY];
        this.move = true;
    }

    private drag_end(ev: MouseEvent) 
    {
        ev.preventDefault();
        this.move = false;
    }

    private create(url: string, style: style_t) 
    {
        // Destroy old instance if existing

        sidebar.destroy();

        // Setup new sidebar

        this.root = sidebar.create_root(style);

        const handle = sidebar.create_handle(style);
        this.root.appendChild(handle);

        const iframe = sidebar.create_iframe(url);
        this.root.appendChild(iframe);

        document.body.appendChild(this.root);

        window.removeEventListener("mousemove", e => this.mouse_move(e));
        window.addEventListener("mousemove", e => this.mouse_move(e));

        handle.removeEventListener("mousedown", e => this.drag_start(e));
        handle.addEventListener("mousedown", e => this.drag_start(e));

        handle.removeEventListener("mouseup", e => this.drag_end(e));
        handle.addEventListener("mouseup", e => this.drag_end(e));

        window[sidebar.LISTENER_ID] = storage.watch("theme", () => 
        {
            sidebar.background().then(bg => this.root.style.background = bg);
            sidebar.color().then(col => document.getElementById(sidebar.HANDLE_ID).style.background = col);
        });
    }
}
