import { clipboard } from '@extend-chrome/clipboard';
import {
  Accordion,
  ActionIcon,
  Alert,
  Badge,
  Center,
  Container,
  Group,
  LoadingOverlay,
  MantineProvider,
  Modal,
  NumberInput,
  Radio,
  Slider,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
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

function Options({
  gibberish,
  setGibberish,
  type,
  setType,
}: {
  gibberish: number;
  setGibberish: (value: number) => void;
  type: 'xpath' | 'css';
  setType: (value: 'xpath' | 'css') => void;
}) {
  return (
    <Accordion variant="separated">
      <Accordion.Item value="Options">
        <Accordion.Control>Options</Accordion.Control>
        <Accordion.Panel>
          <Radio.Group
            name="type"
            value={type}
            withAsterisk
            label="Selector type"
            style={{ marginBottom: 20 }}
            onChange={newType => setType(newType as 'xpath' | 'css')}
            description="Your preferred selector type (Note: XPath is mightier than CSS)"
          >
            <Radio value="xpath" label="XPath" />
            <Radio value="css" label="CSS" />
          </Radio.Group>
          <NumberInput
            defaultValue={gibberish}
            min={0}
            max={1}
            step={0.01}
            noClampOnBlur
            precision={3}
            stepHoldDelay={500}
            stepHoldInterval={0.1}
            onChange={setGibberish}
            label="Gibberish Tolerance"
            description="(Lower = More Gibberish, Higher = Less Gibberish)"
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

function DevTools() {
  const [type, setType] = useState<'xpath' | 'css'>('xpath');
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<unknown>();

  const [gibberish, setGibberish] = useState<number>(0.075);
  const [debouncedGibberish] = useDebouncedValue(gibberish, 200);

  useEffect(() => {
    setResults([]);
    setError(undefined);
    generateSelectors(type, debouncedGibberish).then(setResults).catch(setError);
  }, [type, debouncedGibberish]);

  useEffect(() => {
    chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
      setResults([]);
      setError(undefined);
      generateSelectors(type, gibberish).then(setResults).catch(setError);
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <LoadingOverlay visible={!results} overlayBlur={2} />
      {!!error && <ErrorModal error={error} />}
      <Stack justify="center">
        <Title order={1} align="center">
          Generated Selectors
        </Title>
        <Options type={type} setType={setType} gibberish={gibberish} setGibberish={setGibberish} />
        <ResultTable results={results} />
      </Stack>
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
