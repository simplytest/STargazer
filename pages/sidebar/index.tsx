import { Stack, Tabs, Transition, useMantineTheme } from "@mantine/core";
import { IconBrain, IconSettings } from "@tabler/icons-react";
import Footer from "../../components/footer";
import Generator from "../../components/generator";
import Settings from "../../components/settings";
import create_root from "../../src/react";
import { useState } from "react";

function SideBar()
{
    const theme = useMantineTheme();
    const background = theme.colors[theme.colorScheme === "dark" ? "dark" : "gray"][3];

    const [tab, set_tab] = useState("generator");

    return <Stack style={{ height: "100%" }}>
        <Tabs value={tab} onTabChange={set_tab}>
            <Tabs.List grow bg={background}>
                <Tabs.Tab value="generator" icon={<IconBrain />}>Generator</Tabs.Tab>
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