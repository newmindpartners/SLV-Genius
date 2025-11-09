import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { initNufiDappCardanoSdk } from '@nufi/dapp-client-cardano';
import nufiCoreSdk from '@nufi/dapp-client-core';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

import AppProviders from './components/AppProviders';
import { WalletNetworkStatusNotifier } from './components/WalletNetworkStatusChecker';
import store from './redux/store';
import AppRoutes from './routes';
import { getNufiSdkUrl } from './utils/wallet';

nufiCoreSdk.init(getNufiSdkUrl(import.meta.env.VITE_CARDANO_NETWORK), { zIndex: 9999 });
initNufiDappCardanoSdk(nufiCoreSdk, 'snap');

function App() {
  return (
    <Provider store={store}>
      <AppProviders>
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AppRoutes />
            <WalletNetworkStatusNotifier />
            <CssBaseline />
          </LocalizationProvider>
        </SnackbarProvider>
      </AppProviders>
    </Provider>
  );
}

export default App;
