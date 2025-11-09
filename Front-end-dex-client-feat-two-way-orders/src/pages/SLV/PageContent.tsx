import { Grid, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSLVApi } from '~/hooks/slv/useSLVApi';
import { useWallet } from '~/hooks/wallet/wallet';
import type { TwoWayOrderList } from '~/redux/api/core';

import { WalletConnectBanner } from '../Earn';
import { DEFAULT_POLLING_INTERVAL } from '../Swap/SwapPageContent';
import CreateOrderCard from './components/CreateOrderCard';
import CreateOrderDialog from './components/CreateOrderDialog';
import OrderDetailsDialog from './components/OrderDetailsDialog';
import OrdersTable from './components/OrdersTable';

const PageContent = () => {
  const { isWalletConnected } = useWallet();
  const { orders, isLoading, error, getTwoWayOrders } = useSLVApi();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TwoWayOrderList[number] | null>(
    null,
  );

  useEffect(() => {
    if (isWalletConnected) {
      loadOrders();
    }
  }, [isWalletConnected]);

  useEffect(() => {
    if (!isWalletConnected) return;
    const intervalId = setInterval(() => {
      loadOrders();
    }, DEFAULT_POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [isWalletConnected]);

  const loadOrders = async () => {
    try {
      await getTwoWayOrders();
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const handleCreateOrder = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleOrderCreated = () => {
    setIsCreateDialogOpen(false);
    loadOrders();
  };

  const handleOrderDetailsClose = () => {
    setSelectedOrder(null);
  };

  const handleOrderAction = () => {
    setSelectedOrder(null);
    loadOrders();
  };

  return (
    <Grid display="flex">
      <Content container gap="40px" alignItems="start" wrap="nowrap">
        <Left>
          <CreateOrderCard onCreateOrder={handleCreateOrder} />
        </Left>
        <Right>
          {isWalletConnected ? (
            <OrdersTable
              orders={orders}
              isLoading={isLoading}
              error={error}
              onRefresh={loadOrders}
            />
          ) : (
            <WalletConnectBanner
              collapse={!isWalletConnected}
              sx={{ overflow: 'hidden', padding: '45px 115px' }}
              turnOffFeatures
            />
          )}
        </Right>
        {isCreateDialogOpen && (
          <CreateOrderDialog
            open={isCreateDialogOpen}
            onClose={handleCreateDialogClose}
            onOrderCreated={handleOrderCreated}
          />
        )}
        {selectedOrder && (
          <OrderDetailsDialog
            open={!!selectedOrder}
            order={selectedOrder}
            onClose={handleOrderDetailsClose}
            onOrderAction={handleOrderAction}
          />
        )}
      </Content>
    </Grid>
  );
};

const Content = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '100%',
  margin: '0 auto',
}));

const Left = styled(Grid)(({ theme }) => ({
  flex: '0 0 300px',
  [theme.breakpoints.down('md')]: {
    flex: '0 0 100%',
    marginBottom: theme.spacing(3),
  },
}));

const Right = styled(Grid)({
  flex: '1',
  minWidth: 0,
});

export default PageContent;
