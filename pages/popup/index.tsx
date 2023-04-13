import {
  Badge,
  Button,
  Divider,
  Group,
  Image,
  Space,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { IconDatabase, IconHammer, IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { showError } from '../../components/ErrorModal';
import { isSidebarActive, loadSidebar } from '../../src/sidebar';
import { getHotkey, getVersion } from '../../src/utils/chrome';
import setup from '../../src/utils/react';

function PopUp() {
  const version = getVersion();
  const theme = useMantineTheme();

  const [hotkey, setHotkey] = useState('');
  const [sidebarActive, setSidebarActive] = useState(false);

  useEffect(() => {
    getHotkey().then(setHotkey);
    isSidebarActive().then(setSidebarActive);
  }, []);

  return (
    <Stack align="center" style={{ padding: '10px', width: '300px', height: '500px' }}>
      <Image src="/assets/logo.png" fit="contain" style={{ filter: 'invert(1)' }} width={75} height={75} />
      <Group noWrap p={0}>
        <Title order={1}>STargazer</Title>
        <Badge color="green">v{version}</Badge>
      </Group>
      <Space h={5} />
      <Divider orientation="horizontal" w={280} />
      <Space h={5} />
      <Tooltip
        multiline
        label="You can also use STargazer from the DevTools by inspecting an element and heading over to the 'STargazer' tab, which resides besides 'Styles'"
      >
        <Button
          fullWidth
          leftIcon={<IconHammer />}
          variant="light"
          onClick={() =>
            loadSidebar()
              .then(() => window.close())
              .catch(() =>
                showError(
                  `The extension can't be loaded on pages like the new tab or the chrome web-store. To use the editor navigate to your target application and open it again.`
                )
              )
          }
        >
          {sidebarActive ? 'Reload Editor' : 'Open Editor'}
        </Button>
      </Tooltip>
      <Button
        fullWidth
        variant="light"
        leftIcon={<IconDatabase />}
        onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('pages/store/index.html'), active: true })}
      >
        Open Storage
      </Button>
      <Space h={5} />
      <Divider orientation="horizontal" w={280} />
      <Space h={5} />
      <Stack>
        <Group>
          <Text>Start-Picking Hotkey: </Text>
          <Badge>{hotkey || 'Unset'}</Badge>
        </Group>
      </Stack>
      <Group position="center" noWrap p="sm">
        <IconInfoCircle color={theme.colors.blue[2]} />
        <Text fz="xs" italic align="left">
          You can always change the hotkey under: chrome://extensions/shortcuts
        </Text>
      </Group>
    </Stack>
  );
}

setup(<PopUp />);
