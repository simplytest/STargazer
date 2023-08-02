import { Group, Image, Paper, Stack, Text } from "@mantine/core";

export default function Footer()
{
    return <Stack align="center" style={{ position: "fixed", width: "100%", bottom: 0 }}>
        <Paper style={{ width: "100%" }} shadow="0px -11px 33px -10px rgba(0,0,0,0.15)">
            <Group m="md" noWrap>
                <Image src="/assets/logo.png" height={32} width={32} radius="sm" />
                <Text size="sm">Copyright © {new Date().getFullYear()} <a href="https://simplytest.de/" target="_blank" rel="noreferrer">SimplyTest</a>. All Rights Reserved</Text>
            </Group>
        </Paper>
    </Stack>;
}