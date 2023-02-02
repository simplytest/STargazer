import {
  ActionIcon,
  AppShell,
  CloseButton,
  Grid,
  Group,
  Header,
  LoadingOverlay,
  MantineProvider,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconClick } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorModal } from '../../components/ErrorModal';
import { Options } from '../../components/Options';
import { ResultTable } from '../../components/ResultTable';
import { generateSelectors } from '../../src/generator';
import { Result, SelectorOptions } from '../../src/types/generator';
import { inject } from '../../src/utils/chrome';
import { inspect, unloadInspect } from '../../src/inspectElement';
import { defaultOptions, getOptions, saveOptions } from '../../src/utils/options';
import theme from '../theme';

function Shell({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();

  const close = () => inject(() => document.getElementById('indiana_sidebar').remove());

  const Head = () => (
    <Header height={60} p={5} bg={theme.colors.dark[5]}>
      <Grid>
        <Grid.Col span={10}>
          <Group style={{ height: '100%' }} position="left" noWrap>
            <Title ml={15} align="center">
              Indiana Editor
            </Title>
          </Group>
        </Grid.Col>
        <Grid.Col span={2}>
          <Group style={{ width: '100%', height: '100%' }} position="center" noWrap>
            <CloseButton onClick={close} />
          </Group>
        </Grid.Col>
      </Grid>
    </Header>
  );

  return <AppShell header={<Head />}>{children}</AppShell>;
}

function Editor() {
  const [error, setError] = useState<unknown>();
  const [results, setResults] = useState<Result[]>([]);

  const [inspecting, setInspecting] = useState(false);
  const [options, _setOptions] = useState(defaultOptions);

  const toggleInspect = () => {
    if (inspecting) {
      inject(unloadInspect);
      setInspecting(false);
    } else {
      inject(inspect);
      setInspecting(true);
    }
  };

  const setOptions = (value: SelectorOptions) => {
    saveOptions(value).then(() => _setOptions({ ...value }));
  };

  const generate = (options: SelectorOptions) => {
    setResults([]);
    setError(undefined);
    generateSelectors(options).then(setResults).catch(setError);
  };

  useEffect(() => {
    getOptions().then(options => _setOptions({ ...options }));

    chrome.runtime.onMessage.addListener(message => {
      const { name } = message;

      if (name === 'Selected') {
        setInspecting(false);
        generate(options);
      }

      return false;
    });
  }, []);

  return (
    <>
      <Shell>
        <LoadingOverlay visible={!results} overlayBlur={2} />
        {!!error && <ErrorModal error={error} />}
        <Stack justify="center">
          <Stack style={{ width: '100%' }} m={15} align="center">
            <ActionIcon variant="subtle" color={inspecting ? 'orange' : undefined} onClick={toggleInspect}>
              <IconClick size={32} />
            </ActionIcon>
            <Text fz="sm" italic>
              Select an Element
            </Text>
          </Stack>
          <Options options={options} setOptions={setOptions} />
          <ResultTable results={results} />
        </Stack>
      </Shell>
    </>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <div style={{ width: '100%', height: '100%' }}>
        <Editor />
      </div>
    </MantineProvider>
  </React.StrictMode>
);
