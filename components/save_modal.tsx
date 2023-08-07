import { Badge, Button, Center, Divider, Group, Paper, ScrollArea, Stack, TextInput } from "@mantine/core";
import { ContextModalProps, modals } from "@mantine/modals";
import { IconFolderPlus } from "@tabler/icons-react";
import { useState } from "react";
import { vault } from "../src/vault";
import Folders from "./folders";
import useStorage from "../src/hooks/storage";
import { name_regex } from "../src/validation";

interface SaveModalProps
{
    selector: string;
}

export default function SaveModal({ context, id, innerProps }: ContextModalProps<SaveModalProps>)
{
    const [name, set_name] = useState("");
    const [description, set_description] = useState("");

    const [selector, set_selector] = useState(innerProps.selector);
    const [selected, set_selected] = useStorage<string | undefined>("selected-folder", undefined);

    const valid = name.match(name_regex) && selector.trim().length > 0 && !!selected;

    const save = () =>
    {
        vault.save_with_screenshot(selected, { selector, description, name: name });
        context.closeModal(id);
    };

    return <Stack w={320} m="xs" align="stretch">
        <Paper style={{ width: "100%" }} radius="sm" p="md" withBorder>
            <ScrollArea.Autosize mah={200} type="auto">
                <Folders selected={selected} set_selected={set_selected} />
            </ScrollArea.Autosize>

            <Group position="center" m="md">
                <Badge color="gray" style={{ cursor: "pointer" }}
                    leftSection={
                        <Center>
                            <IconFolderPlus size={12} />
                        </Center>
                    }
                    onClick={
                        () => modals.openContextModal({
                            modal     : "create_folder",
                            title     : "Create Folder",
                            innerProps: {}
                        })
                    }>
                    Create Folder
                </Badge>
            </Group>
        </Paper>

        <Divider />

        <TextInput value={selector} label="Selector" onChange={e => set_selector(e.currentTarget.value)} withAsterisk error={selector.trim().length === 0} />
        <TextInput value={name} label="Name" onChange={e => set_name(e.currentTarget.value)} withAsterisk error={!name.match(name_regex)} />
        <TextInput value={description} label="Description" placeholder="Description..." onChange={e => set_description(e.currentTarget.value)} />

        <Group style={{ width: "100%" }} position="right" noWrap>
            <Button color="dark" onClick={() => context.closeModal(id)}>Cancel</Button>
            <Button disabled={!valid} onClick={save}>Save</Button>
        </Group>
    </Stack>;
}