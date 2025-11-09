import { GlobalStyles } from '@mui/material';
import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import ThemeToggleProvider from './components/ThemeToggleProvider';
import { init as initGTM } from './utils/plugins/gtm';
import { init as initSentry } from './utils/plugins/sentry';
import { createThemeWithMode, generateGlobalStyles } from './utils/theme';

const root = document.getElementById('root');

initSentry();
initGTM();

if (root) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Sentry.ErrorBoundary>
        <ThemeToggleProvider createThemeWithMode={createThemeWithMode}>
          <GlobalStyles styles={generateGlobalStyles} />
          <App />
        </ThemeToggleProvider>
      </Sentry.ErrorBoundary>
    </React.StrictMode>,
  );
}
