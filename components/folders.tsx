import { IconEdit, IconFolder, IconTrashX } from "@tabler/icons-react";
import { vault, vault_t } from "../src/vault";
import { NavLink, Text } from "@mantine/core";
import { useContextMenu } from "mantine-contextmenu";
import { modals } from "@mantine/modals";
import { useStorage } from "../src/hooks/storage";

export interface FoldersProps
{
    selected: string;
    set_selected: (value: string) => void;
}

export default function Folders({ selected, set_selected }: FoldersProps)
{
    const context_menu = useContextMenu();
    const [vault_instance] = useStorage<vault_t>("vault", { folders: [] });

    return vault_instance.folders.map(folder =>
        <NavLink
            key={folder.id}
            label={folder.name}
            icon={<IconFolder />}
            active={selected === folder.id}
            onClick={() => set_selected(folder.id)}
            style={{ borderRadius: "5px" }}
            onContextMenu={context_menu([
                {
                    key    : "Delete",
                    color  : "red",
                    icon   : <IconTrashX />,
                    onClick: () => modals.openConfirmModal({
                        title    : "Are you sure?",
                        onConfirm: () => vault.delete(folder.id),
                        labels   : { confirm: "Yes", cancel: "Cancel" },
                        children : <Text>You are about to delete &quot;{folder.name}&quot;</Text>
                    })
                },
                {
                    key    : "Edit",
                    icon   : <IconEdit />,
                    onClick: () => modals.openContextModal({ modal: "create_folder", title: "Rename Folder", innerProps: { edit: true, id: folder.id } })
                },
            ])}
        />
    );
}