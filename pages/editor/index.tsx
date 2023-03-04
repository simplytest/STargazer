import {
  ActionIcon,
  AppShell,
  CloseButton,
  Grid,
  Group,
  Header,
  LoadingOverlay,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconClick } from '@tabler/icons-react';
import React, { useContext, useEffect, useState } from 'react';
import { showError } from '../../components/ErrorModal';
import { Options } from '../../components/Options';
import { ResultTable } from '../../components/ResultTable';
import generateSelectors from '../../src/generator';
import { removeHighlights } from '../../src/highlight';
import { startPicking, stopPicking } from '../../src/picker';
import { removeSidebar } from '../../src/sidebar';
import { Result } from '../../src/types/generator';
import { Settings } from '../../src/types/settings';
import setup from '../../src/utils/react';
import { SettingsContext } from '../../src/settings/settings';

function Shell({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();

  const onClose = () => {
    stopPicking();
    removeSidebar();
    removeHighlights();
  };

  const Head = () => (
    <Header height={60} p={5} bg={theme.colors.dark[5]}>
      <Grid>
        <Grid.Col span={10}>
          <Group style={{ height: '100%' }} position="left" noWrap>
            <Title ml={15} align="center">
              STargazer
            </Title>
          </Group>
        </Grid.Col>
        <Grid.Col span={2}>
          <Group style={{ width: '100%', height: '100%' }} position="center" noWrap>
            <CloseButton onClick={onClose} />
          </Group>
        </Grid.Col>
      </Grid>
    </Header>
  );

  return <AppShell header={<Head />}>{children}</AppShell>;
}

function Editor() {
  const [loading, setLoading] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const { ...settings } = useContext(SettingsContext);
  const [removeListener, setRemover] = useState<() => void>(undefined);

  const toggleInspect = () => {
    removeHighlights();

    if (inspecting) {
      stopPicking();
      setInspecting(false);
      return;
    }

    startPicking();
    setInspecting(true);
  };

  const generate = (settings: Settings) => {
    removeHighlights();

    setResults([]);
    setLoading(true);

    generateSelectors(settings)
      .then(setResults)
      .catch(showError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!settings.loaded) {
      return;
    }

    generate(settings);

    const listener = (message: { name: string }) => {
      const { name } = message;

      if (name === 'Selected') {
        setInspecting(false);
        generate(settings);
      }

      return false;
    };

    removeListener && removeListener();
    chrome.runtime.onMessage.addListener(listener);
    setRemover(() => () => chrome.runtime.onMessage.removeListener(listener));
  }, Object.values(settings));

  return (
    <>
      <Shell>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <Stack justify="center">
          <Stack style={{ width: '100%', cursor: 'pointer' }} m={15} align="center" onClick={toggleInspect}>
            <ActionIcon variant="subtle" color={inspecting ? 'orange' : undefined}>
              <IconClick size={32} />
            </ActionIcon>
            <Text fz="sm" italic>
              <b>Click</b> to select an Element
            </Text>
          </Stack>
          <Options />
          <ResultTable results={results} />
        </Stack>
      </Shell>
    </>
  );
}

setup(
  <div style={{ width: '100%', height: '100%' }}>
    <Editor />
  </div>
);
