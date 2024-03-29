import { ActionIcon, Alert, Badge, Button, Card, Divider, Group, ScrollArea, Stack, Text, TextInput, Transition } from "@mantine/core";
import { useDebouncedValue, useViewportSize } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconBomb, IconCheck, IconClick, IconCopy, IconDeviceFloppy, IconMoodEmpty, IconMoodTongueWink, IconSkull } from "@tabler/icons-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { check_model } from "../model/messages";
import { highlighter } from "../src/client/highlight";
import { picker, picking_done, suggest_name } from "../src/client/picker";
import { messages } from "../src/extension/messages";
import { result_t } from "../src/generator";
import { failed_to_score } from "../src/generator/messages";
import { useSessionStorage, useStorage } from "../src/hooks/storage";
import CopyButton from "./copy_button";

function Selector({ result, suggested_name }: {result: result_t, suggested_name: string})
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

    const save = () =>
    {
        modals.openContextModal({
            modal     : "save_selector",
            title     : "Save Selector",
            innerProps: {
                selector,
                suggested_name,
            }
        });
    };

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
                        <CopyButton value={selector}>
                            {({ copied, copy }) =>
                                <Button fullWidth radius="xl" color="green" leftIcon={copied ? <IconCheck /> : <IconCopy />} onClick={copy}>
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            }
                        </CopyButton>
                        <Button fullWidth radius="xl" leftIcon={<IconDeviceFloppy />} onClick={save}>
                            Save
                        </Button>
                    </Group>
                </Stack>
            </Card>
        }
    </Transition>;
}

export default function Generator({ id, style }: {id: number, style?: CSSProperties})
{
    const header_size = 313;
    const { height } = useViewportSize();

    const [to_show] = useStorage("result-to-show", 3);
    const [results, set_results] = useSessionStorage<result_t[]>(id, "last-results", null);

    const [suggested_name, set_suggested_name] = useState<string>(undefined);
    const [error, set_error] = useState<false | "empty" | "too-big">(false);
    const [model_available, set_model_available] = useState(true);

    useEffect(() =>
    {
        messages.send(check_model).then(set_model_available);

        messages.register(picking_done, msg =>
        {
            set_results(msg.results);
            set_error(msg.results.length === 0 ? "empty" : false);
        });

        messages.register(failed_to_score, () =>
        {
            set_results([]);
            set_error("too-big");
        });

        messages.register(suggest_name, msg =>
        {
            if (msg.name === false)
            {
                set_model_available(false);
            }

            set_suggested_name(msg.name as string);
        });
    }, []);

    return <Stack align="center" m="lg" style={style}>
        <ActionIcon mt={15} variant="transparent" color="orange" radius="xl" size="xl" onClick={() => picker.start()}>
            <IconClick />
        </ActionIcon>

        <Text fs="italic" c="dimmed" mb={20}>Click to select an Element</Text>

        <Divider style={{ width: "80%" }} my="sm" />

        <ScrollArea.Autosize style={{ width: "100%" }} mah={height - header_size} type="hover">
            <Stack align="center" m="xs">
                {
                    error === "empty" &&
                    <Alert color="red" title="Nothing found!" icon={<IconMoodEmpty />}>
                        We could not find any selectors. <br />
                        This can have several reasons, the most common is that the element you&lsquo;re trying to generate a selector for doesn&lsquo;t have unique properties.<br />
                        If you&lsquo;re certain that <i>good and unique</i> selector exists for this element, feel free to open an issue <a href="https://github.com/simplytest/STargazer/issues/new" target="_blank" rel="noreferrer">here</a>!
                    </Alert>
                }

                {
                    error === "too-big" &&
                    <Alert color="red" title="Too many selectors!" icon={<IconBomb />}>
                        We encountered an error while crunching all the selectors! <br />
                        This error can occur when the &quot;Mutate Top&quot; setting is set to a high value, please lower it and try again.
                    </Alert>
                }

                {
                    (!error && results === null) &&
                <Alert color="lime" title="Welcome!" icon={<IconMoodTongueWink />}>
                    Welcome to STargazer!<br />
                    To begin, simply click the Mouse-Icon above and then select an element on the web-page just like you&lsquo;d do with the developer tools.
                </Alert>
                }
                {
                    !model_available &&
                    <Alert color="red" title="Model unavailable" icon={<IconSkull />}>
                        The Name Suggestion Model is unavailable. <br />
                        For more information check the error log at &quot;chrome://extensions&quot;
                    </Alert>
                }
                {
                    results?.slice(0, to_show).map(x => <Selector key={x.selector} result={x} suggested_name={suggested_name} />)
                }
            </Stack>
        </ScrollArea.Autosize>
    </Stack>;
}