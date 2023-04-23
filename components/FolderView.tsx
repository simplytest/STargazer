import { Badge, Box, BoxProps, Button, Divider, Group, Modal, NavLink, Stack, TextInput } from '@mantine/core';
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
}

export function PageItem({ store, page, parent, setStore, active, setActive, 'data-key': key }: PageItemProps) {
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
      {page && (
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
      {!page && (
        <Group position="right" mt={10}>
          <Badge
            w={150}
            variant="light"
            sx={{ cursor: 'pointer' }}
            leftSection={
              <Group position="center">
                <IconFolderPlus size={14} />
              </Group>
            }
            component="a"
            onClick={open}
          >
            Create Folder
          </Badge>
        </Group>
      )}
    </>
  );
}

export function FolderView({ toSave, ...props }: BoxProps & { toSave: string }) {
  const [store, setStore] = useState<Store>(defaultStore);
  const [active, setActive] = useState<Page>(undefined);
  const [save, setSave] = useState(toSave);
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
            <PageItem store={store} setStore={setStore} active={active} setActive={setActive} parent={store} />
          </Stack>
          <Divider />
          <TextInput name="Selector" onChange={e => setSave(e.target.value)} value={save} />
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
                active?.children.push({ name, image: '', selector: save });
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
