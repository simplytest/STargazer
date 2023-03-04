import { LoadingOverlay, Stack, Title } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { showError } from '../../components/ErrorModal';
import { Options } from '../../components/Options';
import { ResultTable } from '../../components/ResultTable';
import generateSelectors from '../../src/generator';
import { removeHighlights } from '../../src/highlight';
import { isSidebarActive } from '../../src/sidebar';
import { Result } from '../../src/types/generator';
import { Settings } from '../../src/types/settings';
import setup from '../../src/utils/react';
import { SettingsContext } from '../../src/settings/settings';

function DevTools() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const { ...settings } = useContext(SettingsContext);
  const [removeListener, setRemover] = useState<() => void>(undefined);

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

    const listener = () => {
      generate(settings);
    };

    removeListener && removeListener();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(listener);
    setRemover(() => () => chrome.devtools.panels.elements.onSelectionChanged.removeListener(listener));
  }, Object.values(settings));

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Stack justify="center">
        <Title order={1} align="center">
          Generated Selectors
        </Title>
        <Options />
        <ResultTable results={results} />
      </Stack>
    </>
  );
}

isSidebarActive().then(result => {
  if (!result) {
    return setup(
      <div style={{ width: '80%', margin: 'auto', height: '100%' }}>
        <DevTools />
      </div>
    );
  }

  setup(
    <>
      You can't use STargazer from Dev-Tools while the Editor is active, please close it first and then re-open the
      Dev-Tools
    </>
  );
});
