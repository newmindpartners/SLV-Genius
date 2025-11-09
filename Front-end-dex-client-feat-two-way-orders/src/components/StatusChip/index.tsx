import { Grid, styled, Typography } from '@mui/material';
import { FC, memo } from 'react';
import { SwapOrder } from '~/redux/api';
import { isGreater, isLess } from '~/utils/mathUtils';
import { getOrderStatusIconType, OrderClientStatus } from '~/utils/swapOrderUtils';

import { Label } from '../../pages/Swap/components/CurrencyLabel';
import Chip from '../Chip/Chip';
import DotSvg from '../Icons/DotSvg';

type StatusChipProps = {
  content: string;
  order: SwapOrder;

  currency?: string;
  partialFillUnitAmount?: number;
  partialFillPercentage?: number;
  isTransactionCell?: boolean;
};

const StatusChip: FC<StatusChipProps> = ({
  content,
  order,

  currency,
  partialFillUnitAmount = 0,
  partialFillPercentage = 0,
  isTransactionCell = false,
}) => {
  const isOpenOrderPartiallyFilled = (unitAmount: number, unitPercentage: number) =>
    isGreater(unitAmount, 0) &&
    isGreater(unitPercentage, 0) &&
    isLess(unitPercentage, 100);

  const determineOrderStatusType = (
    order: SwapOrder,
    partialFillUnitAmount: number,
    partialFillPercentage: number,
  ): OrderClientStatus => {
    // If the order is partially filled and not cancelled, display it as 'warning'
    if (
      isOpenOrderPartiallyFilled(partialFillUnitAmount, partialFillPercentage) &&
      order.status !== 'CANCELLED'
    ) {
      return 'warning';
    } else {
      return getOrderStatusIconType(order);
    }
  };

  const orderStatusType = isTransactionCell
    ? 'info' // The displayed transactions will always be transactionType: "FILL"
    : determineOrderStatusType(order, partialFillUnitAmount, partialFillPercentage);

  const partialFillPercentageFormatted = partialFillPercentage.toFixed(2);
  const partialFillLabel = `${partialFillUnitAmount} ${currency} (${partialFillPercentageFormatted}%)`;

  return (
    <ChipWrapper
      type="default"
      variant="default"
      label={
        isOpenOrderPartiallyFilled(partialFillUnitAmount, partialFillPercentage) ? (
          <Grid display="flex" flexDirection="column">
            <Label label={content} color="#EAEBEE" />
            <Typography variant="poweredBy" color="#7681A3" lineHeight="14px">
              {partialFillLabel}
            </Typography>
          </Grid>
        ) : (
          <Label label={content} color="#EAEBEE" />
        )
      }
      icon={<DotSvg type={orderStatusType} />}
      clickable={false}
    />
  );
};

const ChipWrapper = styled(Chip)(({ theme }) => ({
  height: '37px',
  padding: '0 9px',
  borderRadius: theme.borderRadius.lg,
}));

const MemoizedStatusChip = memo(StatusChip);

export default MemoizedStatusChip;
