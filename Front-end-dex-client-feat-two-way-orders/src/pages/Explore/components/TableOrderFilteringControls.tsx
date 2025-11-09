import { Grid, styled } from '@mui/material';
import { FC, ReactElement } from 'react';
import OrderStatusFilters from '~/components/EnhancedTable/OrderStatusFilters';
import { SwapOrderStatus } from '~/redux/api';

type TableOrderFilteringControlsProps = {
  orderStatus: SwapOrderStatus | null;
  handleOrderStatusChange: (newStatus: SwapOrderStatus | null) => void;
};

const TableOrderFilteringControls: FC<TableOrderFilteringControlsProps> = ({
  orderStatus,
  handleOrderStatusChange,
}): ReactElement => (
  <Container display="flex" width="100%" justifyContent={'right'} position="relative">
    <Wrapper
      display="flex"
      width="min-content"
      position="absolute"
      bottom="40px"
      right="0px"
      gap="19px"
      alignItems="center"
      flexWrap="nowrap"
      height="40px"
    >
      <OrderStatusFilters
        orderStatus={orderStatus}
        handleOrderStatusChange={handleOrderStatusChange}
      />
    </Wrapper>
  </Container>
);

const Container = styled(Grid)(({ theme }) => ({
  '.viewAllButton': {
    border: 'none',
    padding: 0,
    width: '100px',
    svg: {
      marginLeft: '14px',
    },
  },

  [theme.breakpoints.down('sm')]: {
    justifyContent: 'flex-start',
  },
}));

const Wrapper = styled(Grid)(({ theme }) => ({
  background: '#202740',
  padding: '6px 3px',
  borderRadius: theme.borderRadius.xs,

  [theme.breakpoints.down('sm')]: {
    position: 'static',
    marginBottom: '40px',
  },
}));

export default TableOrderFilteringControls;
