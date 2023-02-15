import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import React from 'react';
import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import theme from '../../pages/theme';
import { SettingsProvider } from './settings';

export default function setup(children: ReactNode) {
  return createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <SettingsProvider>
          <ModalsProvider>{children}</ModalsProvider>
        </SettingsProvider>
      </MantineProvider>
    </React.StrictMode>
  );
}
