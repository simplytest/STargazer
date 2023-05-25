import {
  ActionIcon,
  Badge,
  Box,
  BoxProps,
  Button,
  Divider,
  Group,
  Modal,
  NavLink,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { closeModal, openConfirmModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconFolder, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { defaultStore, getStore, saveStore } from '../src/store';
import { Page, Store } from '../src/types/store';
import { executeScript } from '../src/utils/chrome';

export function createPageModal(page: Page, onConfirm: (name: string) => void) {
  const [pageName, setPageName] = useState('');
  const [opened, { open, close }] = useDisclosure(false);

  return {
    open,
    close,
    modal: (
      <Modal key="createPageModal" opened={opened} title="Create Page" onClose={close} zIndex={99999}>
        <Stack>
          <TextInput
            autoFocus
            label="Name"
            maxLength={25}
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
                if (!pageName || pageName.trim().length === 0) {
                  notifications.show({
                    title: 'Error',
                    color: 'red',
                    icon: <IconX />,
                    message: 'Bad folder name!',
                  });
                  return;
                }

                if (page?.children.find(x => x.name.toLowerCase().trim() === pageName.toLowerCase().trim())) {
                  notifications.show({
                    title: 'Error',
                    color: 'red',
                    icon: <IconX />,
                    message: 'Sub-Page with same name already exists!',
                  });
                  return;
                }

                onConfirm(pageName);
                close();
              }}
            >
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
    ),
  };
}

interface PageItemProps {
  page?: Page;
  parent: Page | Store;

  store: Store;
  setStore: (_: Store) => void;

  active?: Page;
  setActive: (_: Page) => void;

  ['data-key']?: string;
  topLevel?: boolean;
}

export function PageItem({
  store,
  page,
  parent,
  setStore,
  active,
  setActive,
  'data-key': key,
  topLevel,
}: PageItemProps) {
  const children = page?.children || [];
  const subPages = children.filter(x => 'children' in x) as Page[];

  const { open, modal } = createPageModal(page, pageName => {
    executeScript(() => window.location.hostname).then(hostname => {
      (page || store).children.push({ name: pageName, children: [], url: hostname, id: uuidv4() });
      saveStore(store).then(() => {
        setStore({ ...store });
      });
    });
  });

  return (
    <>
      {modal}
      {page && (
        <NavLink
          label={page.name}
          icon={
            <Group spacing={2} position="center" noWrap>
              <IconFolder />
              <Divider ml={5} orientation="vertical" />
              <ActionIcon
                color="red"
                onClick={() => {
                  openConfirmModal({
                    title: 'Are you sure?',
                    onConfirm: () => {
                      parent.children = parent.children.filter(x => x !== page);
                      saveStore(store).then(() => {
                        setStore({ ...store });
                      });
                    },
                    labels: { confirm: 'Yes', cancel: 'Cancel' },
                    children: <Text size="sm">This will permanently delete the selected page</Text>,
                  });
                }}
              >
                <IconTrash size={16} />
              </ActionIcon>
              <ActionIcon onClick={open}>
                <IconPlus size={16} />
              </ActionIcon>
              <Divider orientation="vertical" />
            </Group>
          }
          onClick={() => setActive(page)}
          active={active?.id === page?.id}
          description={topLevel && page.url}
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
                <IconPlus size={14} />
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
                topLevel
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
            autoFocus
            label="Name"
            maxLength={25}
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
                if (!name || name.trim().length === 0) {
                  notifications.show({
                    title: 'Error',
                    color: 'red',
                    icon: <IconX />,
                    message: 'No name given!',
                  });
                  return;
                }

                if (!active) {
                  notifications.show({
                    title: 'Error',
                    color: 'red',
                    icon: <IconX />,
                    message: 'No Folder selected!',
                  });
                  return;
                }

                if (active.children.find(x => x.name.toLowerCase().trim() === name.toLowerCase().trim())) {
                  notifications.show({
                    title: 'Error',
                    color: 'red',
                    icon: <IconX />,
                    message: 'Selector with same name exists!',
                  });
                  return;
                }

                chrome.tabs.captureVisibleTab(undefined, { format: 'jpeg', quality: 60 }).then(image => {
                  active?.children.push({ name, image: image, selector: save });
                  saveStore(store).then(() => {
                    setStore({ ...store });
                    closeModal('saveModal');
                    chrome.runtime.sendMessage(null, { name: 'update-store' });
                  });
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
