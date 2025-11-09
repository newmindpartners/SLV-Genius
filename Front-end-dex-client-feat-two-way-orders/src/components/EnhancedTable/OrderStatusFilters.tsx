import { Grid } from '@mui/material';
import { map } from 'lodash';
import { FC } from 'react';
import { SwapOrderStatus } from '~/redux/api';

import OrderStatusButton from './OrderStatusButton';

export const orderStatusButtonsMap: Record<string, SwapOrderStatus | null> = {
  all: null,
  open: 'OPEN',
};

type OrderStatusFiltersProps = {
  orderStatus: SwapOrderStatus | null;
  handleOrderStatusChange: (newStatus: SwapOrderStatus | null) => void;
};

const OrderStatusFilters: FC<OrderStatusFiltersProps> = ({
  orderStatus,
  handleOrderStatusChange,
}) => (
  <Grid display="flex" gap="5px" justifyContent="center" alignItems="center">
    {map(orderStatusButtonsMap, (status, label) => (
      <OrderStatusButton
        key={label}
        value={label}
        isActive={orderStatus === status}
        onClick={() => handleOrderStatusChange(status)}
      />
    ))}
  </Grid>
);

export default OrderStatusFilters;
