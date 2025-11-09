import { Grid } from '@mui/material';
import { useState } from 'react';
import EnhancedTable from '~/components/EnhancedTable';
import useSwapOrdersFormatting from '~/hooks/swap/list-orders/useSwapListOrdersFormatting';
import EmptyTableScreen from '~/pages/Explore/components/EmptyTableScreen';
import { tableHeadlines } from '~/pages/Explore/mocks';
import { SwapOrder } from '~/redux/api';

export interface OrderTableProps {
  orders: SwapOrder[];
  isLoading: boolean;
  isInitialLoading: boolean;
}

export const OrderTable = ({ isLoading, isInitialLoading, orders }: OrderTableProps) => {
  const ordersRows = useSwapOrdersFormatting({ orders });
  const [expandedRowId, setExpandedRowId] = useState<string | number | null>(null);

  if (!isLoading && !isInitialLoading && !orders.length) {
    return (
      <EmptyTableScreen
        title="No orders exist"
        description="Trading bot has not yet made any orders"
      />
    );
  }

  return (
    <Grid container direction="column" rowGap="20px">
      <EnhancedTable
        orders={ordersRows}
        headlines={tableHeadlines}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        expandedRowId={expandedRowId}
        setExpandedRowId={setExpandedRowId}
      />

      {/* <TablePagination isLoading={isLoading} /> */}
    </Grid>
  );
};
