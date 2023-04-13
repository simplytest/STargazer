import { useEffect, useState } from 'react';
import { defaultStore, getStore, saveStore } from '../../src/store';
import setup from '../../src/utils/react';
import { Store, Page, Selector } from '../../src/types/store';
import {
  ActionIcon,
  AppShell,
  Divider,
  Group,
  NavLink,
  Navbar,
  Stack,
  Table,
  TextInput,
  Title,
  Text,
  Button,
  SimpleGrid,
  Card,
  Select,
} from '@mantine/core';
import {
  IconCheck,
  IconDatabase,
  IconDeviceFloppy,
  IconFileExport,
  IconFolder,
  IconPhotoOff,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface FolderProps {
  page: Page;
  ['data-key']: string;

  active?: Page;
  setActive: (_: Page) => void;
}

function Folder({ page, active, setActive, 'data-key': key }: FolderProps) {
  const children = page?.children || [];
  const subPages = children.filter(x => 'children' in x) as Page[];

  return (
    <NavLink
      label={page.name}
      icon={<IconFolder />}
      description={page.url}
      onClick={() => setActive(page)}
      active={active?.id === page?.id}
    >
      {subPages.length > 0 &&
        subPages.map(x => (
          <Folder
            page={x}
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
        <IconPhotoOff size={12} />
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
  const [active, setActive] = useState<Page>(undefined);

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
              <Folder page={x} active={active} setActive={setActive} data-key={x.name} key={x.name} />
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
                {active.children
                  .filter(x => 'selector' in x)
                  .map((x: Selector) => (
                    <SelectorItem item={x} parent={active} setParent={setActive} key={x.name} />
                  ))}
              </tbody>
            </Table>
          </Stack>
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
                label="Language"
                placeholder="Pick one"
                data={[
                  { value: 'csharp', label: 'C#' },
                  { value: 'nodejs', label: 'Node.Js' },
                ]}
              />

              <Button variant="light" color="blue" fullWidth mt="md" radius="md">
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
