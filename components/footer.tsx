import { Divider, Group, Image, Stack, Text } from "@mantine/core";
import React from "react";

export default function Footer()
{
    return <Stack align="center" style={{marginTop: "auto"}} mb={15}>
        <Divider style={{width: "80%"}} my="sm"/>
        <Group noWrap>
            <Image src="/assets/logo.png" height={32} width={32} radius="md" />
            <Text size="sm">Copyright © {new Date().getFullYear()} <a href="https://simplytest.de/" target="_blank" rel="noreferrer" >SimplyTest</a>. All Rights Reserved</Text>
        </Group>
    </Stack>;
}