import { LoadingOverlay, MantineProvider, Stack, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorModal } from '../../components/ErrorModal';
import { Options } from '../../components/Options';
import { ResultTable } from '../../components/ResultTable';
import { generateSelectors } from '../../src/generator';
import { loaded } from '../../src/sidebar';
import { Result, SelectorOptions } from '../../src/types/generator';
import { defaultOptions, getOptions, saveOptions } from '../../src/utils/options';
import theme from '../theme';

function Warning() {
  return (
    <ErrorModal
      persistent
      error="You can't use Indiana from Dev-Tools while the Editor is active, please close it first and then re-open the Dev-Tools"
    />
  );
}

function DevTools() {
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [options, _setOptions] = useState(defaultOptions);

  const setOptions = (value: SelectorOptions) => {
    saveOptions(value).then(() => _setOptions({ ...value }));
  };

  const generate = (options: SelectorOptions) => {
    setResults([]);
    setLoading(true);
    setError(undefined);

    generateSelectors(options)
      .then(setResults)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getOptions().then(options => _setOptions({ ...options }));
  }, []);

  useEffect(() => {
    generate(options);
  }, [options]);

  useEffect(() => {
    chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
      generate(options);
    });
  }, [options]);

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      {!!error && <ErrorModal error={error} />}
      <Stack justify="center">
        <Title order={1} align="center">
          Generated Selectors
        </Title>
        <Options options={options} setOptions={setOptions} />
        <ResultTable results={results} />
      </Stack>
    </>
  );
}

loaded().then(result => {
  createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <MantineProvider withGlobalStyles theme={theme}>
        <div style={{ width: '100%', height: '100%' }}>{result ? <Warning /> : <DevTools />}</div>
      </MantineProvider>
    </React.StrictMode>
  );
});
