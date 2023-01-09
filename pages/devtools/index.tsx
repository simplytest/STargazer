import { clipboard } from '@extend-chrome/clipboard';
import {
  ActionIcon,
  Alert,
  Badge,
  Center,
  Group,
  LoadingOverlay,
  MantineProvider,
  Modal,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { IconAlertTriangle, IconCopy, IconDatabaseOff } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { generateSelectors } from '../../src/generator';
import { Result } from '../../src/types/generator';
import theme from '../theme';

function ErrorModal({ error }: { error: unknown }) {
  const [open, setOpen] = useState(true);

  return (
    <Modal centered title="Whoops!" onClose={() => setOpen(!open)} opened={open}>
      <Group noWrap>
        <Group align="center">
          <IconAlertTriangle size={16} color="red" />
        </Group>
        <Text>{error.toString()}</Text>
      </Group>
    </Modal>
  );
}

function ResultTable({ results }: { results: Result[] }) {
  const mapped = results.map(result => (
    <tr key={result.selector}>
      <td>
        <Badge color="gray">{result.occurrences}</Badge>
      </td>
      <td>
        <TextInput
          disabled
          value={result.selector}
          rightSection={
            <ActionIcon
              onClick={async () => {
                await clipboard.writeText(result.selector);
              }}
            >
              <IconCopy />
            </ActionIcon>
          }
        />
      </td>
    </tr>
  ));

  return mapped.length > 0 ? (
    <Table>
      <thead>
        <tr>
          <th>Occurrences</th>
          <th>Selector</th>
        </tr>
      </thead>
      <tbody>{mapped}</tbody>
    </Table>
  ) : (
    <div style={{ width: '100%' }}>
      <Center>
        <Alert icon={<IconDatabaseOff size={16} />} title="Nothing to see here!" color="yellow">
          We could not generate any selectors for the given element...
        </Alert>
      </Center>
    </div>
  );
}

function DevTools() {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    generateSelectors()
      .then(result => setResults(result))
      .catch(error => setError(error));
  }, []);

  useEffect(() => {
    chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
      setError(undefined);
      generateSelectors()
        .then(result => setResults(result))
        .catch(error => setError(error));
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <LoadingOverlay visible={!results} overlayBlur={2} />
      {!!error && <ErrorModal error={error} />}
      <Group align="center">
        <h1>Generated Selectors</h1>
        <ResultTable results={results} />
      </Group>
    </div>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles theme={theme}>
      <DevTools />
    </MantineProvider>
  </React.StrictMode>
);
