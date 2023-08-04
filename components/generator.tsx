import { clipboard } from "@extend-chrome/clipboard";
import { ActionIcon, Alert, Badge, Button, Card, Divider, Group, ScrollArea, Stack, Text, TextInput, Transition } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconCheck, IconClick, IconCopy, IconDeviceFloppy, IconMoodEmpty, IconMoodTongueWink } from "@tabler/icons-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { highlighter } from "../src/client/highlight";
import { picker, picking_done } from "../src/client/picker";
import { messages } from "../src/extension/messages";
import { result_t } from "../src/generator";
import useStorage from "../src/hooks/storage";

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

    return <Button fullWidth radius="xl" color="green" leftIcon={copied ? <IconCheck /> : <IconCopy />} onClick={copy}>
        {copied ? "Copied" : "Copy"}
    </Button>;
}

function Selector({ result }: {result: result_t})
{
    const [mounted, set_mounted] = useState(false);
    const [selector, set_selector] = useState(result.selector);

    const [show_raw] = useStorage("show-raw", false);
    const [show_scores] = useStorage("show-scores", false);

    const ref = useRef<HTMLInputElement>();
    const [debounced_selector] = useDebouncedValue(selector, 100);

    useEffect(() =>
    {
        if (document.activeElement !== ref.current)
        {
            return;
        }

        highlighter.start(selector);
    }, [debounced_selector]);

    useEffect(() =>
    {
        set_mounted(true);
    }, []);

    return <Transition mounted={mounted} transition="pop">
        {styles =>
            <Card shadow="md" padding="lg" radius="md" style={{ ...styles, width: "100%" }} withBorder>
                <Card.Section p={15}>
                    <TextInput value={selector} onChange={e => set_selector(e.currentTarget.value)} ref={ref} />
                </Card.Section>
                <Stack>
                    <Badge fullWidth color={result.occurrences === 1 ? "lime" : "red"} size="md" variant="light">
                        {result.occurrences} {result.occurrences > 1 ? "Occurrences" : "Occurrence"}
                    </Badge>
                    {show_scores &&
                    <Badge fullWidth color="gray" size="md" variant="light">
                        Score: {result.score}
                    </Badge>
                    }
                    {show_raw &&
                     <TextInput value={JSON.stringify(result.chain)} />
                    }
                    <Group position="right" align="center" noWrap>
                        <CopyButton value={selector} />
                        <Button fullWidth radius="xl" leftIcon={<IconDeviceFloppy />}>
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
    const [results, set_results] = useStorage<result_t[]>("last-results", null);
    const [to_show] = useStorage("result-to-show", 3);
    const [error, set_error] = useState(false);

    useEffect(() =>
    {
        messages.register(picking_done, msg =>
        {
            set_results(msg.results);
            set_error(msg.results.length === 0);
        });
    }, []);

    return <Stack align="center" m="lg" style={style}>
        <ActionIcon mt={15} variant="transparent" color="orange" radius="xl" size="xl" onClick={() => picker.start()}>
            <IconClick />
        </ActionIcon>

        <Text fs="italic" c="dimmed" mb={20}>Click to select an Element</Text>

        <Divider style={{ width: "80%" }} my="sm" />

        {
            error &&
                    <Alert color="red" title="Nothing found!" icon={<IconMoodEmpty />}>
                        We could not find any selectors. <br />
                        This can have several reasons, the most common is that the element you&lsquo;re trying to generate a selector for doesn&lsquo;t have unique properties.<br />
                        If you&lsquo;re certain that <i>good and unique</i> selector exists for this element, feel free to open an issue <a href="https://github.com/simplytest/STargazer/issues/new" target="_blank" rel="noreferrer">here</a>!
                    </Alert>
        }

        {
            (!error && results === null) &&
                <Alert color="lime" title="Welcome!" icon={<IconMoodTongueWink />}>
                    Welcome to STargazer!<br />
                    To begin, simply click the Mouse-Icon above and then select an element on the web-page just like you&lsquo;d do with the developer tools.
                </Alert>
        }

        <ScrollArea.Autosize style={{ width: "100%" }} mah={520} type="hover">
            <Stack align="center" m="xs">
                {
                    results?.slice(0, to_show).map(x => <Selector key={x.selector} result={x} />)
                }
            </Stack>
        </ScrollArea.Autosize>
    </Stack>;
}