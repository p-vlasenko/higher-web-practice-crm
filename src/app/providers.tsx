import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';
import type { ReactNode } from 'react';

import { store } from './store';
import { crmTheme } from '../styles/theme';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <MantineProvider theme={crmTheme}>
        <Notifications />
        {children}
      </MantineProvider>
    </Provider>
  );
}
