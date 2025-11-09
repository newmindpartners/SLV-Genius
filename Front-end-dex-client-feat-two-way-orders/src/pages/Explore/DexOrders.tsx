import { Grid } from '@mui/material';
import { filter } from 'lodash';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import EnhancedTableContainer from '~/components/EnhancedTable';
import TablePagination from '~/components/EnhancedTable/TablePagination';
import TradingPairsContextProvider from '~/context/tradingPairsContext';
import useSwapListOrdersFormatting from '~/hooks/swap/list-orders/useSwapListOrdersFormatting';
import useSwapListOrdersSorted, {
  UseSwapListOrdersSortedConfig,
  UseSwapListOrdersSortedParams,
} from '~/hooks/swap/list-orders/useSwapListOrdersSorted';
import EmptyTableScreen from '~/pages/Explore/components/EmptyTableScreen';
import ExploreLayout from '~/pages/Explore/components/ExploreLayout';

import CustomGlobalStyles from '../Swap/CustomGlobalStyles';
import { DEFAULT_POLLING_INTERVAL } from '../Swap/SwapPageContent';
import Dialogs from './Dialogs';
import DialogsProviders from './DialogsProviders';
import { tableHeadlines } from './mocks';

const DexOrders = () => {
  const { pathname } = useLocation();

  return (
    <TradingPairsContextProvider>
      <DialogsProviders>
        <CustomGlobalStyles />
        <ExploreLayout dropdownTitle={pathname}>
          <DexOrdersPageContent />
          <Dialogs />
        </ExploreLayout>
      </DialogsProviders>
    </TradingPairsContextProvider>
  );
};

const DexOrdersPageContent = () => {
  const [expandedRowId, setExpandedRowId] = useState<number | string | null>(null);

  const orderFilterCriteria: UseSwapListOrdersSortedParams = {
    count: 20,
    filterByOrderSwapStatus: 'FILLED',
  };

  const hookConfigOptions: UseSwapListOrdersSortedConfig = {
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
  } = useSwapListOrdersSorted(orderFilterCriteria, hookConfigOptions);

  const HIDE_FEE_COLUMN = true;

  const ordersRows = useSwapListOrdersFormatting({
    orders: ordersData?.results || [],
    hideFeeColumn: HIDE_FEE_COLUMN,
  });

  const headlinesWithoutFeeColumn = filter(
    tableHeadlines,
    (headline) => headline.content !== 'Fee',
  );

  return ordersRows.length || isLoadingOrders ? (
    <Grid container direction="column" rowGap="20px">
      <EnhancedTableContainer
        orders={ordersRows}
        headlines={headlinesWithoutFeeColumn}
        isInitialLoading={isLoadingOrders}
        isLoading={isLoadingWithArgsUpdated}
        sortState={sortState}
        hideFeeColumn={HIDE_FEE_COLUMN}
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
  );
};

export default DexOrders;
