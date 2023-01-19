import { clipboard } from '@extend-chrome/clipboard';
import {
  Accordion,
  ActionIcon,
  Alert,
  Badge,
  Center,
  Group,
  LoadingOverlay,
  MantineProvider,
  Modal,
  NumberInput,
  Radio,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAlertTriangle, IconCopy, IconDatabaseOff } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { generateSelectors } from '../../src/generator';
import { Result, SelectorOptions } from '../../src/types/generator';
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
  const color = (occurrences: number) => {
    if (occurrences === 1) {
      return 'green';
    }
    if (occurrences < 5) {
      return 'orange';
    }
    return 'red';
  };

  const mapped = results.map(result => (
    <tr key={result.selector}>
      <td>
        <Badge color={color(result.occurrences)}>{result.occurrences}</Badge>
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

function Options({ options, setOptions }: { options: SelectorOptions; setOptions: (value: SelectorOptions) => void }) {
  const update = <T,>(key: keyof SelectorOptions, value: T) => {
    const copy = { ...options };
    (copy[key] as T) = value;
    setOptions(copy);
  };

  if (!options) {
    return;
  }

  return (
    <Accordion variant="separated">
      <Accordion.Item value="Options">
        <Accordion.Control>Options</Accordion.Control>
        <Accordion.Panel>
          <Radio.Group
            name="type"
            withAsterisk
            value={options.type}
            label="Selector type"
            style={{ marginBottom: 20 }}
            onChange={v => update('type', v)}
            description="Your preferred selector type (Note: XPath is mightier than CSS)"
          >
            <Radio value="xpath" label="XPath" />
            <Radio value="css" label="CSS" />
          </Radio.Group>
          <NumberInput
            min={0}
            max={1}
            step={0.01}
            noClampOnBlur
            precision={3}
            stepHoldDelay={500}
            stepHoldInterval={0.1}
            style={{ marginBottom: 20 }}
            label="Gibberish Tolerance"
            defaultValue={options.gibberishTolerance}
            onChange={v => update('gibberishTolerance', v)}
            description="(Lower = More Gibberish, Higher = Less Gibberish)"
          />
          <Switch
            label="Hide Ambiguous"
            checked={options.onlyUnique}
            style={{ marginBottom: 20 }}
            description="Hides selectors with more than one occurrence"
            onChange={v => update('onlyUnique', v.currentTarget.checked)}
            onLabel="ON"
            offLabel="OFF"
          />
          <NumberInput
            min={1}
            max={Infinity}
            step={1}
            label="Results to display"
            value={options.resultsToDisplay}
            description="Only show first N results"
            onChange={v => update('resultsToDisplay', v)}
          />
          <NumberInput
            min={-Infinity}
            max={Infinity}
            step={1}
            label="Score Tolerance"
            value={options.scoreTolerance}
            description="Only show results with scores above N"
            onChange={v => update('scoreTolerance', v)}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

function DevTools() {
  const [error, setError] = useState<unknown>();
  const [results, setResults] = useState<Result[]>([]);

  const [options, _setOptions] = useState<SelectorOptions>({
    type: 'xpath',
    onlyUnique: true,
    resultsToDisplay: 5,
    scoreTolerance: -100,
    gibberishTolerance: 0.073,
  });

  const setOptions = (value: SelectorOptions) => {
    chrome.storage.local.set({ options: value }).then(() => _setOptions({ ...value }));
  };

  useEffect(() => {
    chrome.storage.local.get(['options']).then(results => {
      if (!results.options) {
        return;
      }
      setOptions({ ...results.options });
    });
  }, []);

  const generate = (options: SelectorOptions) => {
    setResults([]);
    setError(undefined);
    generateSelectors(options).then(setResults).catch(setError);
  };

  useEffect(() => {
    generate(options);
  }, [options]);

  useEffect(() => {
    chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
      generate(options);
    });
  }, [options]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <LoadingOverlay visible={!results} overlayBlur={2} />
      {!!error && <ErrorModal error={error} />}
      <Stack justify="center">
        <Title order={1} align="center">
          Generated Selectors
        </Title>
        <Options options={options} setOptions={setOptions} />
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
