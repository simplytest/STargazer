import { Badge, Group, MantineProvider, Space, Stack, Text } from '@mantine/core';
import { IconHeartHandshake } from '@tabler/icons';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { getHotkey, getVersion } from '../../src/utils/extension';
import theme from '../theme';

function PopUp() {
  const [hotkey, setHotkey] = React.useState('');
  const version = getVersion();

  useEffect(() => {
    getHotkey().then(setHotkey);
  }, []);

  return (
    <Stack align="center" style={{ padding: '10px', width: '300px', height: '500px' }}>
      <img src="/assets/logo.png" style={{ width: '75px', height: '75px', marginBottom: -40 }} />
      <h1 style={{ paddingBottom: 0, margin: 0 }}>Indiana</h1>
      <Group>
        <Text>Version</Text>
        <Badge color="green">{version}</Badge>
      </Group>
      <hr style={{ width: '80%' }} />
      <Text align="center">
        <a href="https://developer.chrome.com/docs/devtools/open/" target="_blank" rel="noreferrer">
          Open the Dev-Tools
        </a>{' '}
        and use the specified hotkey to freeze the webpage if necessary. Use the "Inspect Element" feature to locate
        your desired element and head over to the "Indiana" tab on the right besides "Styles"
      </Text>
      <Group position="center">
        <Badge color="orange">{hotkey || '<No Hotkey set>'}</Badge>
        {!hotkey && (
          <Text italic align="center">
            You can change your hotkeys under "chrome://extensions/shortcuts"
          </Text>
        )}
      </Group>
      <hr style={{ width: '80%' }} />
      <Space style={{ marginTop: 'auto', marginBottom: 'auto' }} />
      <Text>
        Made with <IconHeartHandshake color="red" /> by{' '}
        <a href="https://simplytest.de/" target="_blank" rel="noreferrer">
          SimplyTest
        </a>
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
