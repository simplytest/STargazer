import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ReactNode, StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import theme from "../shared/theme";
import { storage } from "./extension/storage";

function Root({ children }: {children: ReactNode})
{
    const [user_theme, set_theme] = useState<ColorScheme>("light");

    const toggle_theme = (value?: ColorScheme) => 
    {
        const new_theme = value || (user_theme === "dark" ? "light" : "dark"); 
        
        set_theme(new_theme);  
        storage.set("theme", new_theme);
    };

    useEffect(() => 
    {
        storage.get<ColorScheme>("theme").then(value => set_theme(value || "light"));
        storage.watch("theme", toggle_theme);
    }, []);

    return  <StrictMode>
        <ColorSchemeProvider colorScheme={user_theme} toggleColorScheme={toggle_theme}>
            <MantineProvider theme={{ ...theme, colorScheme: user_theme }} withGlobalStyles withNormalizeCSS>
                {children}
            </MantineProvider>
        </ColorSchemeProvider>
    </StrictMode>;
}

export default function create_root(children: ReactNode) 
{
    return createRoot(document.getElementById("root") as HTMLElement).render(
        <Root>
            {children}
        </Root>
    );
}