import {
  ActionIcon,
  AppShell,
  Button,
  Card,
  Divider,
  Group,
  Image,
  NavLink,
  Navbar,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconDatabase,
  IconDeviceFloppy,
  IconFileExport,
  IconFolder,
  IconPhotoOff,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useContextMenu } from 'mantine-contextmenu';
import { useEffect, useState } from 'react';
import generate, { Language } from '../../src/page-object';
import { defaultStore, getStore, saveStore } from '../../src/store';
import { Page, Selector, Store } from '../../src/types/store';
import setup from '../../src/utils/react';
import { title } from 'process';

interface FolderProps {
  page: Page;
  parent: Page | Store;

  ['data-key']: string;

  active?: Page;
  setActive: (_: Page) => void;

  store: Store;
  setStore: (_: Store) => void;
}

function Folder({ page, parent, store, setStore, active, setActive, 'data-key': key }: FolderProps) {
  const children = page?.children || [];
  const showContextMenu = useContextMenu();
  const subPages = children.filter(x => 'children' in x) as Page[];

  return (
    <NavLink
      label={page.name}
      icon={<IconFolder />}
      description={page.url}
      onClick={() => setActive(page)}
      active={active?.id === page?.id}
      onContextMenu={showContextMenu([
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
          <Folder
            page={x}
            parent={page}
            store={store}
            setStore={setStore}
            setActive={setActive}
            active={active}
            key={`${key}-${x.name}`}
            data-key={`${key}-${x.name}`}
          />
        ))}
    </NavLink>
  );
}

interface SelectorItemProps {
  item: Selector;

  parent: Page;
  setParent: (_: Page) => void;
}

function SelectorItem({ item, parent, setParent }: SelectorItemProps) {
  const [name, setName] = useState(item.name);
  const [selector, setSelector] = useState(item.selector);

  useEffect(() => {
    item.name = name;
    item.selector = selector;
  }, [name, selector]);

  return (
    <tr>
      <td align="center">
        {item.image?.length > 0 ? (
          <Image
            maw={80}
            radius="md"
            src={item.image}
            sx={{ cursor: 'pointer' }}
            onClick={() => openModal({ children: <Image src={item.image} radius="md" /> })}
          />
        ) : (
          <IconPhotoOff size={12} />
        )}
      </td>
      <td>
        <TextInput value={name} onChange={e => setName(e.target.value)} />
      </td>
      <td>
        <TextInput value={selector} onChange={e => setSelector(e.target.value)} />
      </td>
      <td>
        <ActionIcon
          color="red"
          onClick={() => {
            parent.children = parent.children.filter(x => x !== item);
            setParent({ ...parent });
          }}
        >
          <IconTrash />
        </ActionIcon>
      </td>
    </tr>
  );
}

function Store() {
  const [store, setStore] = useState<Store>(defaultStore);
  const [lang, setLang] = useState<string | null>(null);
  const [active, setActive] = useState<Page>(undefined);

  const selectors = active?.children?.filter(x => 'selector' in x) || [];

  useEffect(() => {
    getStore().then(store => setStore({ ...store }));
  }, []);

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar p="xs" width={{ base: 300 }}>
          <Navbar.Section>
            <Group position="center" align="center">
              <IconDatabase />
              <Title order={3}>Saved Pages</Title>
            </Group>
            <hr />
          </Navbar.Section>
          <Stack spacing={0}>
            {store.children.map(x => (
              <Folder
                parent={store}
                store={store}
                setStore={setStore}
                page={x}
                active={active}
                setActive={setActive}
                data-key={x.name}
                key={x.name}
              />
            ))}
          </Stack>
        </Navbar>
      }
    >
      {active && (
        <>
          <Stack align="center">
            <Title order={1}>{active.name}</Title>
            <Divider />
            <Text c="dimmed" mt={-35} mb={20}>
              {active.url}
            </Text>
            {selectors.length > 0 && (
              <Table withBorder withColumnBorders>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Selector</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectors.map((x: Selector) => (
                    <SelectorItem item={x} parent={active} setParent={setActive} key={x.name} />
                  ))}
                </tbody>
              </Table>
            )}
          </Stack>
          {selectors.length > 0 && (
            <>
              <Group mt={15} position="right">
                <Button
                  leftIcon={<IconPlus />}
                  color="gray"
                  onClick={() => {
                    active.children.push({
                      image: '',
                      name: `New Selector (${active.children.length})`,
                      selector: '',
                    } as Selector);
                    setActive({ ...active });
                  }}
                >
                  Add Selector
                </Button>
                <Button
                  leftIcon={<IconDeviceFloppy />}
                  onClick={() => {
                    saveStore(store).then(() => {
                      setStore({ ...store });

                      notifications.show({
                        title: 'Saved!',
                        color: 'green',
                        icon: <IconCheck />,
                        message: 'Changes were saved successfully!',
                      });
                    });
                  }}
                >
                  Save Changes
                </Button>
              </Group>
              <Divider mt={25} />
            </>
          )}
          <Group position="center" mt={50}>
            <Card shadow="sm" padding="lg" radius="md" w={250} withBorder>
              <Card.Section bg="#181A25">
                <Group h={80} position="center">
                  <IconFileExport size={45} />
                </Group>
              </Card.Section>

              <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>Export Page-Object</Text>
              </Group>

              <Text size="sm" color="dimmed">
                Export this page as a page-object file in your desired language
              </Text>

              <Select
                value={lang}
                onChange={setLang}
                label="Language"
                placeholder="Pick one"
                data={[
                  { value: 'csharp', label: 'C#' },
                  { value: 'java', label: 'Java' },
                  { value: 'javascript', label: 'JavaScript' },
                  { value: 'typescript', label: 'TypeScript' },
                ]}
              />

              <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => {
                  if (!lang) {
                    notifications.show({
                      title: 'Error',
                      color: 'red',
                      icon: <IconX />,
                      message: 'No language selected!',
                    });
                    return;
                  }
                  openModal({ children: generate(lang as Language, active) });
                }}
              >
                Export
              </Button>
            </Card>
          </Group>
        </>
      )}
    </AppShell>
  );
}

setup(<Store />);
