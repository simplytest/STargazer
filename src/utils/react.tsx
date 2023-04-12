import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import React, { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import theme from '../../pages/theme';
import { SettingsProvider } from '../settings/settings';

export default function setup(children: ReactNode) {
  return createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <SettingsProvider>
          <ModalsProvider>{children}</ModalsProvider>
        </SettingsProvider>
      </MantineProvider>
    </React.StrictMode>
  );
}
