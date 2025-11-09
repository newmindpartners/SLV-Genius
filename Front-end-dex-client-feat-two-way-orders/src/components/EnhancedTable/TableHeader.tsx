import { Grid, styled, Typography } from '@mui/material';
import { FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/components/AppLayout/config';
import { RightArrow } from '~/components/Icons/RightArrow';
import { SwapOrderStatus } from '~/redux/api';

import Button from '../Button/Button';
import OrderStatusFilters from './OrderStatusFilters';

type TableHeaderProps = {
  label: string;

  orderStatus: SwapOrderStatus | null;
  handleOrderStatusChange: (newStatus: SwapOrderStatus | null) => void;
};

const TableHeader: FC<TableHeaderProps> = ({
  label,

  orderStatus,
  handleOrderStatusChange,
}): ReactElement => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    window.scrollTo({
      top: 0,
    });
    navigate(ROUTES.EXPLORE__MY_ORDERS);
  };

  return (
    <Container
      display="flex"
      width="100%"
      justifyContent="space-between"
      container
      direction="row"
      mb="20px"
      position="relative"
    >
      <Grid display="flex" gap="19px" alignItems="center" flexWrap="nowrap">
        <Typography
          fontFamily="Mulish"
          variant="teamUserTitle"
          fontWeight="800"
          fontSize="20px"
          lineHeight="28px"
          color="textColor.light"
        >
          {label}
        </Typography>

        <OrderStatusFilters
          orderStatus={orderStatus}
          handleOrderStatusChange={handleOrderStatusChange}
        />
      </Grid>

      <Button
        className="viewAllButton"
        color="transparent"
        disableRipple={true}
        onClick={handleViewAll}
      >
        View All <RightArrow />
      </Button>
    </Container>
  );
};

const Container = styled(Grid)({
  '.viewAllButton': {
    border: 'none',
    padding: 0,
    width: '100px',
    svg: {
      marginLeft: '14px',
    },
  },
});

export default TableHeader;
