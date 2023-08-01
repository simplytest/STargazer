import { Stack, Switch, useMantineColorScheme } from "@mantine/core";

export default function Settings()
{
    const { colorScheme: theme, toggleColorScheme: toggle_theme } = useMantineColorScheme();
    const dark = theme === "dark";

    return <Stack m="lg">
        <Switch checked={dark} onChange={() => toggle_theme()} label="Dark Theme" />
    </Stack>;
}