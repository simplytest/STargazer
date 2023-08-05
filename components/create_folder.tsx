import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { vault, vault_t } from "../src/vault";
import { ContextModalProps } from "@mantine/modals";
import { storage } from "../src/extension/storage";

export default function CreateFolderModal({ context, id, innerProps }: ContextModalProps<{edit?: boolean, id?: string}>)
{
    const [name, set_name] = useState("");
    const valid = name.trim().length > 0;

    const create = () =>
    {
        if (innerProps.edit)
        {
            vault.edit(innerProps.id, "folder", { name });
        }
        else
        {
            vault.create(name);
        }

        context.closeModal(id);
    };

    useEffect(() =>
    {
        if (!innerProps.id || !innerProps.edit)
        {
            return;
        }

        storage.get<vault_t>("vault").then(vault =>
        {
            if (!vault)
            {
                return;
            }

            const folder = vault.folders.find(x => x.id === innerProps.id);

            if (!folder)
            {
                return;
            }

            set_name(folder.name);
        });
    }, []);


    return <Stack m="xs" align="stretch">
        <TextInput value={name} label="Name" onChange={e => set_name(e.currentTarget.value)} withAsterisk error={!valid} />

        <Group style={{ width: "100%" }} position="right" noWrap>
            <Button disabled={!valid} onClick={create}>
                {innerProps.edit ? "Edit" : "Create"}
            </Button>
        </Group>
    </Stack>;
}