import * as Sentry from '@sentry/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PoolPageIcon } from '~/components/Icons/pageIcons/PoolPageIcon';
import Page404 from '~/pages/404';
import DexOrders from '~/pages/Explore/DexOrders';
import MyOrders from '~/pages/Explore/MyOrders';

import AppLayout from './components/AppLayout';
import { ROUTES } from './components/AppLayout/config';
import AppDialogs from './components/Dialogs/AppDialogs';
import { SwapPageIcon } from './components/Icons/pageIcons/SwapPageIcon';
import TradingPairsContextProvider from './context/tradingPairsContext';
import { useWallet } from './hooks/wallet/wallet';
import ComingSoon from './pages/ComingSoon';
import Earn from './pages/Earn';
import DialogsProviders from './pages/Explore/DialogsProviders';
import { Leaderboard } from './pages/Leaderboard';
import { Options } from './pages/Options';
import ReleaseNotes from './pages/ReleaseNotes';
import SLV from './pages/SLV';
import OrderDetailsPage from './pages/SLV/OrderDetailsPage';
import { SmartVaultDetails } from './pages/SmartVaultDetails';
import SmartVaults from './pages/SmartVaults';
import Swap from './pages/Swap';
import { TradingWallet } from './pages/TradingWallet';
import { hostnames, isHostname } from './utils/envVar';

const data = {
  swap: {
    title: 'Swap',
    image: <SwapPageIcon />,
    description: 'Coming soon...',
  },
  pool: {
    title: 'Pool',
    image: <PoolPageIcon />,
    description: 'Coming soon...',
  },
};

const COMING_SOON_BANNER_TITLE = 'page not available for the moment';
const COMING_SOON_BANNER_TEXT = 'We are working hard to make it available soon';

const SentryRoutes = Sentry.withSentryRouting(Routes);

const AppRoutes = () => {
  const { isWalletConnected } = useWallet();
  const exploreRouteDestination = isWalletConnected
    ? ROUTES.EXPLORE__MY_ORDERS
    : ROUTES.EXPLORE__DEX_ORDERS;

  return (
    <BrowserRouter>
      <SentryRoutes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.PAGE_404} element={<Page404 />} />
          <Route path={ROUTES.HOME} />
          <Route path={ROUTES.SWAP} element={<Swap />} />
          {isHostname([hostnames.dev, hostnames.local]) && (
            <Route path={ROUTES.OPTIONS} element={<Options />} />
          )}
          <Route
            path={ROUTES.POOL}
            element={
              <ComingSoon
                title={`${data.pool.title} ${COMING_SOON_BANNER_TITLE}`}
                description={COMING_SOON_BANNER_TEXT}
                image={data.pool.image}
              />
            }
          />

          <Route path={ROUTES.EXPLORE__MY_ORDERS} element={<MyOrders />} />
          <Route path={ROUTES.EXPLORE__DEX_ORDERS} element={<DexOrders />} />
          <Route
            path={ROUTES.EXPLORE}
            element={<Navigate to={exploreRouteDestination} replace />}
          />

          <Route path={ROUTES.EARN} element={<Earn />} />
          <Route path={ROUTES.EARN_UTILITY_NFT_CHECKER} element={<Earn />} />
          <Route path={ROUTES.RELEASE_NOTES} element={<ReleaseNotes />} />
          <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
          <Route path={ROUTES.BOT_DETAILS} element={<TradingWallet />} />

          {isHostname([hostnames.dev, hostnames.local]) && (
            <>
              <Route path={ROUTES.SMART_VAULTS} element={<SmartVaults />} />
              <Route path={ROUTES.SMART_VAULT_DETAILS} element={<SmartVaultDetails />} />
              <Route path={ROUTES.SLV} element={<SLV />} />
              <Route
                path={ROUTES.SLV_ORDER_DETAILS}
                element={
                  <TradingPairsContextProvider>
                    <DialogsProviders>
                      <OrderDetailsPage />
                    </DialogsProviders>
                  </TradingPairsContextProvider>
                }
              />
            </>
          )}
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.SWAP} replace />} />
      </SentryRoutes>
      <AppDialogs />
    </BrowserRouter>
  );
};
export default AppRoutes;
