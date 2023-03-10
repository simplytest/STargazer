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
import { useEffect, useState } from 'react';
import { isSidebarActive, loadSidebar } from '../../src/sidebar';
import { getHotkey, getVersion } from '../../src/utils/chrome';
import setup from '../../src/utils/react';
import { showError } from '../../components/ErrorModal';

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
      <Divider orientation="horizontal" w={280} />
      <Space h="xs" />
      <Button
        fullWidth
        onClick={() =>
          loadSidebar(theme.colors.dark[8], theme.colors.dark[3])
            .then(() => window.close())
            .catch(error =>
              showError(
                `Could not load the editor: ${error}\nPlease beware that the extension can't be loaded on pages like the new tab or the chrome web-store.`
              )
            )
        }
      >
        {sidebarActive ? 'Reload Editor' : 'Open Editor'}
      </Button>
      <Text fz="sm" italic align="center">
        Or use the DevTools by inspecting an element and then opening the "STargazer" tab besides "Styles"
      </Text>
      <Space h="xs" />
      <Divider orientation="horizontal" w={280} />
      <Tooltip label="Causes the page execution to halt">
        <Group>
          <Text>Debugger Hotkey: </Text>
          <Badge>{hotkey || 'Unset'}</Badge>
        </Group>
      </Tooltip>
      <Text fz="sm" italic align="center">
        You can always change the hotkey under: chrome://extensions/shortcuts
      </Text>
    </Stack>
  );
}

setup(<PopUp />);
