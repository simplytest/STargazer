import { createContext, ReactNode, useEffect, useState } from 'react';
import { defaultSettings } from '../settings/defaults';
import { Settings } from '../types/settings';

interface SettingsSetter {
  setType: (v: Settings['type']) => void;
  setOnlyUnique: (v: Settings['onlyUnique']) => void;
  setScoreTolerance: (v: Settings['scoreTolerance']) => void;
  setResultsToDisplay: (v: Settings['resultsToDisplay']) => void;
}

const update = <C extends keyof Settings>(name: C, set: (v: Settings[C]) => void) => {
  return (value: Settings[C]) => {
    chrome.storage.local.set({ [name]: value }).then(() => set(value));
  };
};

const get = <C extends keyof Settings>(name: C, set: (v: Settings[C]) => void) => {
  chrome.storage.local.get(name).then(result => {
    set(result?.[name] ?? defaultSettings[name]);
  });
};

export const SettingsContext = createContext<Settings & SettingsSetter & { loaded: boolean }>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [type, setType] = useState(defaultSettings.type);
  const [onlyUnique, setOnlyUnique] = useState(defaultSettings.onlyUnique);
  const [scoreTolerance, setScoreTolerance] = useState(defaultSettings.scoreTolerance);
  const [resultsToDisplay, setResultsToDisplay] = useState(defaultSettings.resultsToDisplay);

  useEffect(() => {
    setLoaded(false);

    get('type', setType);
    get('onlyUnique', setOnlyUnique);
    get('scoreTolerance', setScoreTolerance);
    get('resultsToDisplay', setResultsToDisplay);

    setLoaded(true);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        loaded,

        type,
        setType: update('type', setType),
        onlyUnique,
        setOnlyUnique: update('onlyUnique', setOnlyUnique),
        scoreTolerance,
        setScoreTolerance: update('scoreTolerance', setScoreTolerance),
        resultsToDisplay,
        setResultsToDisplay: update('resultsToDisplay', setResultsToDisplay),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
