import { Grid } from '@mui/material';
import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EnhancedTableContainer from '~/components/EnhancedTable';
import TablePagination from '~/components/EnhancedTable/TablePagination';
import TradingPairsContextProvider from '~/context/tradingPairsContext';
import useSwapListOrdersFormatting from '~/hooks/swap/list-orders/useSwapListOrdersFormatting';
import useSwapListOrdersSorted, {
  UseSwapListOrdersSortedConfig,
  UseSwapListOrdersSortedParams,
} from '~/hooks/swap/list-orders/useSwapListOrdersSorted';
import { useWallet } from '~/hooks/wallet/wallet';
import EmptyTableScreen from '~/pages/Explore/components/EmptyTableScreen';
import ExploreLayout from '~/pages/Explore/components/ExploreLayout';
import { SwapOrderStatus } from '~/redux/api';

import CustomGlobalStyles from '../Swap/CustomGlobalStyles';
import { DEFAULT_POLLING_INTERVAL } from '../Swap/SwapPageContent';
import TableOrderFilteringControls from './components/TableOrderFilteringControls';
import Dialogs from './Dialogs';
import DialogsProviders from './DialogsProviders';
import { tableHeadlines } from './mocks';

const MyOrders = () => {
  const { pathname } = useLocation();

  return (
    <TradingPairsContextProvider>
      <DialogsProviders>
        <CustomGlobalStyles />
        <ExploreLayout dropdownTitle={pathname}>
          <MyOrderPageContent />
          <Dialogs />
        </ExploreLayout>
      </DialogsProviders>
    </TradingPairsContextProvider>
  );
};

const MyOrderPageContent: FC = () => {
  const [expandedRowId, setExpandedRowId] = useState<number | string | null>(null);
  const [orderStatus, setOrderStatus] = useState<SwapOrderStatus | null>(null);

  const { isWalletConnected, walletStakeKeyHash } = useWallet();

  const orderFilterCriteria: UseSwapListOrdersSortedParams = {
    count: 20,
    filterByWalletStakeKeyHash: walletStakeKeyHash,
    filterByOrderSwapStatus: orderStatus || undefined,
  };

  const hookConfigOptions: UseSwapListOrdersSortedConfig = {
    skip: !isWalletConnected,
    pollingInterval: DEFAULT_POLLING_INTERVAL,
  };

  const {
    data: {
      data: ordersData,
      isLoading: isLoadingOrders,
      isFetching: isFetchingOrders,
      isLoadingWithArgsUpdated,
    },
    pagination,
    sortState,
    handleSortChange,
    resetPagination,
  } = useSwapListOrdersSorted(orderFilterCriteria, hookConfigOptions);

  const ordersRows = useSwapListOrdersFormatting({
    orders: ordersData?.results || [],
    ordersTableExpandedRowId: expandedRowId,
    isMyOrders: true,
  });

  const handleOrderStatusChange = (newStatus: SwapOrderStatus | null) => {
    setOrderStatus(newStatus);
    resetPagination();
  };

  return (
    <>
      {isWalletConnected ? (
        <Grid container direction="column">
          <TableOrderFilteringControls
            orderStatus={orderStatus}
            handleOrderStatusChange={handleOrderStatusChange}
          />

          <EnhancedTableContainer
            orders={ordersRows}
            headlines={tableHeadlines}
            isInitialLoading={isLoadingOrders}
            isLoading={isLoadingWithArgsUpdated}
            sortState={sortState}
            handleSortChange={handleSortChange}
            expandedRowId={expandedRowId}
            setExpandedRowId={setExpandedRowId}
          />

          <TablePagination isLoading={isFetchingOrders} {...pagination} />
        </Grid>
      ) : (
        <EmptyTableScreen
          title="No open orders yet"
          description="There are not any open orders created yet"
          buttonText="Create Order"
        />
      )}
    </>
  );
};

export default MyOrders;
