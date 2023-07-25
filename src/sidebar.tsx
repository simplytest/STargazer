import { scripting } from "./scripting";
import theme from "../shared/theme";

import { IconArrowsMove } from "@tabler/icons-react";
import { renderToString } from "react-dom/server";
import React from "react";

type html_t = string;
type color_t = string;
type style_t = { background: color_t; handle: color_t; icon: html_t };

export class sidebar 
{
    static readonly MAXIMUM_ZINDEX = "2147483647";
    static readonly ID = "stargazer_sidebar";

    private root: HTMLDivElement;
    private initial_pos = [0, 0];
    private move = false;

    static async open() 
    {
        const url = chrome.runtime.getURL("pages/editor/index.html");
        const icon = renderToString(<IconArrowsMove />);

        const style: style_t = {
            background: theme.colors.dark[8],
            handle: theme.colors.dark[6],
            icon: icon,
        };

        await scripting.export();

        await scripting.execute(
            async (url: string, style: style_t) => 
            {
                const instance = new sidebar();
                instance.create(url, style);
            },
            url,
            style
        );
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

    private static destroy() 
    {
        const instance = document.getElementById(sidebar.ID);

        if (!instance) 
        {
            return;
        }

        instance.remove();
    }

    private static create_root(style: style_t) 
    {
        const root = document.createElement("div");

        root.style.zIndex = sidebar.MAXIMUM_ZINDEX;
        root.id = sidebar.ID;

        root.style.border = `1px solid ${style.background}`;
        root.style.background = style.background;

        root.style.position = "fixed";
        root.style.right = "0px";
        root.style.top = "0px";

        root.style.width = "400px";
        root.style.height = "85%";

        return root;
    }

    private static create_handle(style: style_t) 
    {
        const handle = document.createElement("div");

        handle.style.background = style.handle;
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

        iframe.style.height = "100%";
        iframe.style.width = "100%";

        iframe.style.border = "none";
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

        window.removeEventListener("mousemove", (ev) => this.mouse_move(ev));
        window.addEventListener("mousemove", (ev) => this.mouse_move(ev));

        handle.removeEventListener("mousedown", (ev) => this.drag_start(ev));
        handle.addEventListener("mousedown", (ev) => this.drag_start(ev));

        handle.removeEventListener("mouseup", (ev) => this.drag_end(ev));
        handle.addEventListener("mouseup", (ev) => this.drag_end(ev));
    }
}
