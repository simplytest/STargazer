import { Box, BoxProps, Button, Divider, Group, Modal, NavLink, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { closeModal } from '@mantine/modals';
import { IconFolder, IconFolderPlus, IconTrash } from '@tabler/icons-react';
import { useContextMenu } from 'mantine-contextmenu';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { defaultStore, getStore, saveStore } from '../src/store';
import { Page, Store } from '../src/types/store';
import { executeScript } from '../src/utils/chrome';

interface PageItemProps {
  page?: Page;
  parent: Page | Store;

  store: Store;
  setStore: (_: Store) => void;

  active?: Page;
  setActive: (_: Page) => void;

  ['data-key']?: string;
  ['root-button']?: boolean;
}

export function PageItem({
  store,
  page,
  parent,
  setStore,
  active,
  setActive,
  'root-button': root,
  'data-key': key,
}: PageItemProps) {
  const children = page?.children || [];
  const showContextMenu = useContextMenu();
  const [pageName, setPageName] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const subPages = children.filter(x => 'children' in x) as Page[];

  return (
    <>
      <Modal opened={opened} title="Create Page" onClose={close} zIndex={99999}>
        <Stack>
          <TextInput
            label="Name"
            value={pageName}
            description="Name for the new page"
            onChange={e => setPageName(e.target.value)}
            withAsterisk
          />
          <Group position="right">
            <Button color="gray" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                executeScript(() => window.location.hostname).then(hostname => {
                  (page || store).children.push({ name: pageName, children: [], url: hostname, id: uuidv4() });
                  saveStore(store).then(() => {
                    setStore({ ...store });
                    close();
                  });
                });
              }}
            >
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
      {root ? (
        <NavLink icon={<IconFolderPlus />} label="Create" description="Create a new page" onClick={() => open()} />
      ) : (
        <NavLink
          label={page.name}
          icon={<IconFolder />}
          description={page.url}
          onClick={() => setActive(page)}
          active={active?.id === page?.id}
          onContextMenu={showContextMenu([
            {
              key: 'new',
              onClick: open,
              title: 'New Page',
              icon: <IconFolderPlus />,
            },
            {
              color: 'red',
              key: 'delete',
              title: 'Delete',
              icon: <IconTrash size={16} />,
              onClick: () => {
                parent.children = parent.children.filter(x => x !== page);
                saveStore(store).then(() => {
                  setStore({ ...store });
                });
              },
            },
          ])}
        >
          {subPages.length > 0 &&
            subPages.map(x => (
              <PageItem
                page={x}
                active={active}
                setActive={setActive}
                parent={page}
                store={store}
                setStore={setStore}
                key={`${key}-${x.name}`}
                data-key={`${key}-${x.name}`}
              />
            ))}
        </NavLink>
      )}
    </>
  );
}

export function FolderView({ toSave, ...props }: BoxProps & { toSave: string }) {
  const [store, setStore] = useState<Store>(defaultStore);
  const [active, setActive] = useState<Page>(undefined);
  const [name, setName] = useState('');

  useEffect(() => {
    getStore().then(store => setStore({ ...store }));
  }, []);

  return (
    store && (
      <Box {...props}>
        <Stack>
          <Stack spacing={0}>
            {store.children.map(x => (
              <PageItem
                page={x}
                store={store}
                setStore={setStore}
                active={active}
                setActive={setActive}
                key={x.name}
                data-key={x.name}
                parent={store}
              />
            ))}
            <PageItem
              root-button
              store={store}
              setStore={setStore}
              active={active}
              setActive={setActive}
              key="create-root"
              parent={store}
            />
          </Stack>
          <Divider />
          <TextInput name="Selector" disabled value={toSave} />
          <TextInput
            label="Name"
            description="Name for the selector"
            withAsterisk
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Group position="right">
            <Button color="gray" onClick={() => closeModal('saveModal')}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                active?.children.push({ name, image: '', selector: toSave });
                saveStore(store).then(() => {
                  setStore({ ...store });
                  closeModal('saveModal');
                });
              }}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </Box>
    )
  );
}
