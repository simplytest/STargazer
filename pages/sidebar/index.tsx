import { Stack, Tabs, Transition, useMantineTheme } from "@mantine/core";
import { IconBrain, IconLock, IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import Footer from "../../components/footer";
import Generator from "../../components/generator";
import Settings from "../../components/settings";
import create_root from "../../src/react";

function SideBar()
{
    const theme = useMantineTheme();
    const background = theme.colors[theme.colorScheme === "dark" ? "dark" : "gray"][3];

    const no_active = {
        borderColor: "inherit",
        color      : "inherit"
    };

    const [tab, set_tab] = useState("generator");

    const open_vault = () =>
    {
        const vault = chrome.runtime.getURL("/pages/vault/index.html");
        window.open(vault);
    };

    return <Stack style={{ height: "100%" }}>
        <Tabs value={tab} onTabChange={set_tab}>
            <Tabs.List grow bg={background}>
                <Tabs.Tab value="generator" icon={<IconBrain />}>Generator</Tabs.Tab>
                <Tabs.Tab value={tab} icon={<IconLock />} style={no_active} onClick={open_vault}>Vault</Tabs.Tab>
                <Tabs.Tab value="settings" icon={<IconSettings />}>Configure</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="generator">
                <Transition transition="fade" mounted={tab === "generator"}>
                    {style => <Generator style={style} />}
                </Transition>
            </Tabs.Panel>

            <Tabs.Panel value="settings">
                <Transition transition="fade" mounted={tab === "settings"}>
                    {style => <Settings style={style} />}
                </Transition>
            </Tabs.Panel>
        </Tabs>
        <Footer />
    </Stack>;
}

create_root(<SideBar />);