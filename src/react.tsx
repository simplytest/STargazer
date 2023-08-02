import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import theme from "../shared/theme";
import useStorage from "./hooks/storage";

function Root({ children }: {children: ReactNode})
{
    const [user_theme, set_theme] = useStorage<ColorScheme>("theme", "light");
    const toggle_theme = (value?: ColorScheme) => set_theme(value || (user_theme === "dark" ? "light" : "dark"));

    return <StrictMode>
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