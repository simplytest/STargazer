import { Stack, Tabs, useMantineTheme } from "@mantine/core";
import { IconBrain, IconSettings } from "@tabler/icons-react";
import Footer from "../../components/footer";
import Generator from "../../components/generator";
import Settings from "../../components/settings";
import create_root from "../../src/react";

function SideBar()
{
    const theme = useMantineTheme();
    const background = theme.colors[theme.colorScheme === "dark" ? "dark" : "gray"][4];

    return <Stack style={{ height: "100%" }}>
        <Tabs defaultValue="generator">
            <Tabs.List grow bg={background}>
                <Tabs.Tab value="generator" icon={<IconBrain/>}>Generator</Tabs.Tab>
                <Tabs.Tab value="settings" icon={<IconSettings/>}>Configure</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="generator">
                <Generator />
            </Tabs.Panel>
            
            <Tabs.Panel value="settings">
                <Settings />
            </Tabs.Panel>
        </Tabs>
        <Footer/>
    </Stack>;
}

create_root(<SideBar/>);