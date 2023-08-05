import { ActionIcon, AppShell, Button, Center, Group, Header, Image, Navbar, Stack, Table, Text, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconBrandGithub, IconCopy, IconPlus, IconSettings, IconTrashX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { default as Zoom } from "react-zoom-image-hover";
import Folders, { FoldersProps } from "../../components/folders";
import Settings from "../../components/settings";
import useStorage from "../../src/hooks/storage";
import create_root from "../../src/react";
import { entry_t, folder_t, vault, vault_t } from "../../src/vault";

function ShellHeader()
{
    return <Header height={60} p="xs">
        <Group position="apart">
            <Group noWrap>
                <Image src="/assets/logo.png" height={32} width={32} radius="sm" />
                <Text
                    gradient={{ from: "#EB6739", to: "#0084CA" }}
                    variant="gradient"
                    ta="center"
                    fw={700}
                    fz={28}
                >
                STargazer
                </Text>
            </Group>
            <Group noWrap>
                <Button variant="outline" color="gray" leftIcon={<IconSettings size="1rem" />} onClick={() => modals.open({ title: "Settings", children: <Settings /> })}>
                    Settings
                </Button>
                <Button variant="outline" color="gray" leftIcon={<IconBrandGithub size="1rem" />} component="a" href="https://github.com/simplytest/STargazer" target="_blank">
                    GitHub
                </Button>
            </Group>
        </Group>
    </Header>;
}

function ShellNavbar({ ...props }: FoldersProps)
{
    return <Navbar width={{ base: 300 }} p="xs">
        <Folders {...props} />
        <Center m="md">
            <ActionIcon size="md" radius="xl" variant="outline" onClick={() => modals.openContextModal({
                modal     : "create_folder",
                title     : "Create Folder",
                innerProps: {}
            })}>
                <IconPlus size={12} />
            </ActionIcon>
        </Center>
    </Navbar>;
}

function Entry({ folder, entry }: {folder: string, entry: entry_t})
{
    const [name, set_name] = useState(entry.name);
    const [selector, set_selector] = useState(entry.selector);
    const [description, set_description] = useState(entry.description);

    const [debounced_name] = useDebouncedValue(name, 200);
    const [debounced_selector] = useDebouncedValue(selector, 200);
    const [debounced_description] = useDebouncedValue(description, 200);

    useEffect(() =>
    {
        document.title = "STargazer - Vault";
    }, []);

    useEffect(() =>
    {
        if (!name || !selector || name?.trim().length === 0 || selector?.trim().length === 0)
        {
            return;
        }

        vault.edit(entry.id, "entry", { name, selector, description });
    }, [debounced_name, debounced_selector, debounced_description]);

    return <tr>
        <td>
            <Image
                radius="md"
                width={128}
                height={64}
                withPlaceholder
                src={entry.image}
                style={{ cursor: "pointer" }}
                onClick={() =>
                {
                    modals.open({
                        title       : "Image Preview",
                        overlayProps: {
                            opacity: 0.55,
                            blur   : 3,
                        },
                        withOverlay    : true,
                        size           : "auto",
                        transitionProps: { transition: "pop" },
                        children       : <Zoom src={entry.image} width={600} height={800} zoomScale={3} />
                    });
                }}
            />
        </td>
        <td>
            <TextInput value={name} onChange={e => set_name(e.currentTarget.value)} withAsterisk error={name?.trim().length === 0} />
        </td>
        <td>
            <TextInput value={selector} onChange={e => set_selector(e.currentTarget.value)} withAsterisk error={selector?.trim().length === 0} />
        </td>
        <td>
            <TextInput value={description} onChange={e => set_description(e.currentTarget.value)} />
        </td>
        <td>
            <Group noWrap>
                <ActionIcon size="lg" color="red" onClick={() => modals.openConfirmModal({
                    title    : "Are you sure?",
                    onConfirm: () => vault.delete(entry.id),
                    labels   : { confirm: "Yes", cancel: "Cancel" },
                    children : <Text>You are about to delete &quot;{entry.name}&quot;</Text>
                })}>
                    <IconTrashX size={20} />
                </ActionIcon>
                <ActionIcon size="lg" onClick={() => vault.save(folder, { selector: entry.selector, description: entry.description, name: entry.name })}>
                    <IconCopy size={20} />
                </ActionIcon>
            </Group>
        </td>
    </tr>;
}

function Vault()
{
    const [folder, set_folder] = useState<folder_t>(null);
    const [instance] = useStorage<vault_t>("vault", { folders: [] });
    const [selected, set_selected] = useStorage<string | undefined>("selected-folder", undefined);

    useEffect(() =>
    {
        set_folder(instance.folders.find(x => x.id === selected));
    }, [selected, instance]);

    return <AppShell
        padding="md"
        header={<ShellHeader />}
        navbar={<ShellNavbar selected={selected} set_selected={set_selected} />}
    >
        <Stack justify="center" align="center" style={{ width: "100%" }}>
            {folder &&
                <>
                    <Table verticalSpacing="xs">
                        <thead>
                            <tr>
                                <th>Preview</th>
                                <th>Name</th>
                                <th>Selector</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {folder.children.map(entry =>
                                <Entry key={entry.id} folder={folder.id} entry={entry} />
                            )}
                        </tbody>
                    </Table>
                    <ActionIcon size="md" radius="xl" variant="outline" onClick={() => vault.save(folder.id, { name: "Name", selector: "Selector" })}>
                        <IconPlus size={12} />
                    </ActionIcon>
                </>
            }
        </Stack>
    </AppShell>;
}

create_root(<Vault />);