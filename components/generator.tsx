import { ActionIcon, Badge, Button, Card, Divider, Group, ScrollArea, Stack, Text, TextInput, Transition } from "@mantine/core";
import { IconCheck, IconClick, IconCopy, IconDeviceFloppy } from "@tabler/icons-react";
import { CSSProperties, useEffect, useState } from "react";
import { picker } from "../src/client/picker";
import { clipboard } from "@extend-chrome/clipboard";

function CopyButton({ value }: {value: string})
{
    const [copied, set_copied] = useState(false);

    const copy = () =>
    {
        clipboard.writeText(value).then(() =>
        {
            set_copied(true);
            setTimeout(() => set_copied(false), 1000);
        });
    };

    return <Button radius="xl" color="green" leftIcon={copied ? <IconCheck /> : <IconCopy />} onClick={copy}>
        {copied ? "Copied" : "Copy"}
    </Button>;
}

function Selector({ selector: _selector, occurrences }: {selector: string, occurrences: number})
{
    const [mounted, set_mounted] = useState(false);
    const [selector, set_selector] = useState(_selector);

    useEffect(() =>
    {
        set_mounted(true);
    }, []);

    return <Transition mounted={mounted} transition="pop">
        {styles =>
            <Card shadow="md" padding="lg" radius="md" style={{ ...styles, width: "95%" }} withBorder>
                <Card.Section p={15}>
                    <TextInput value={selector} onChange={e => set_selector(e.target.value)} />
                </Card.Section>
                <Stack>
                    <Badge fullWidth color="lime" size="md" variant="light">
                        {occurrences} {occurrences > 1 ? "Occurrences" : "Occurrence"}
                    </Badge>
                    <Group position="right" align="center" noWrap>
                        <CopyButton value={selector} />
                        <Button radius="xl" leftIcon={<IconDeviceFloppy />}>
                            Save
                        </Button>
                    </Group>
                </Stack>
            </Card>
        }
    </Transition>;
}

export default function Generator({ style }: {style?: CSSProperties})
{
    return <Stack align="center" m="lg" style={style}>
        <ActionIcon mt={15} variant="transparent" color="orange" radius="xl" size="xl" onClick={() => picker.start()}>
            <IconClick />
        </ActionIcon>

        <Text fs="italic" c="dimmed" mb={20}>Click to select an Element</Text>

        <Divider style={{ width: "80%" }} my="sm" />

    </Stack>;
}