import {
  Badge,
  Button,
  Divider,
  Group,
  Image,
  MantineProvider,
  Space,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { load, loaded } from '../../src/sidebar';
import { getHotkey, getVersion } from '../../src/utils/extension';
import theme from '../theme';

function PopUp() {
  const [isLoaded, setLoaded] = useState(false);
  const [hotkey, setHotkey] = useState('');
  const theme = useMantineTheme();
  const version = getVersion();

  useEffect(() => {
    getHotkey().then(setHotkey);
    loaded().then(setLoaded);
  }, []);

  const loadSidebar = () => {
    load(theme.colors.dark[8], theme.colors.dark[3]).then(() => window.close());
  };

  return (
    <Stack align="center" style={{ padding: '10px', width: '300px', height: '500px' }}>
      <Image src="/assets/logo.png" fit="contain" width={75} height={75} mb={-40} />
      <Group noWrap p={0}>
        <Title order={1}>Indiana</Title>
        <Badge color="green">v{version}</Badge>
      </Group>
      <Space h="md" />
      <Divider orientation="horizontal" w={280} />
      <Space h="xs" />
      <Button fullWidth onClick={loadSidebar}>
        {isLoaded ? 'Reload Editor' : 'Open Editor'}
      </Button>
      <Text fz="sm" italic align="center">
        Or use the DevTools by inspecting an element and then opening the "Indiana" tab besides "Styles"
      </Text>
      <Space h="xs" />
      <Divider orientation="horizontal" w={280} />
      <Space h="sm" />
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

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <PopUp />
    </MantineProvider>
  </React.StrictMode>
);
