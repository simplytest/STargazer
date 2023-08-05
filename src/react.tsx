import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import theme from "../shared/theme";
import useStorage from "./hooks/storage";
import { ModalsProvider } from "@mantine/modals";
import SaveModal from "../components/save_modal";
import CreateFolderModal from "../components/create_folder";
import { ContextMenuProvider } from "mantine-contextmenu";

function Root({ children }: {children: ReactNode})
{
    const [user_theme, set_theme] = useStorage<ColorScheme>("theme", "light");
    const toggle_theme = (value?: ColorScheme) => set_theme(value || (user_theme === "dark" ? "light" : "dark"));

    return <StrictMode>
        <ColorSchemeProvider colorScheme={user_theme} toggleColorScheme={toggle_theme}>
            <MantineProvider theme={{ ...theme, colorScheme: user_theme }} withGlobalStyles withNormalizeCSS>
                <ContextMenuProvider>
                    <ModalsProvider modals={{ save_selector: SaveModal, create_folder: CreateFolderModal }}>
                        {children}
                    </ModalsProvider>
                </ContextMenuProvider>
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