import { Button, Grid, styled, Typography } from '@mui/material';
import { shouldForwardProp } from '@mui/system';
import { FC } from 'react';

import DownArrowSVG from '../Icons/DownArrowSVG';

type ExpandableOrdersButtonProps = {
  rowId: string;
  ordersTableExpandedRowId: string | number | null;
  transactionsCount: number;
};

const ExpandableOrdersButton: FC<ExpandableOrdersButtonProps> = ({
  rowId,
  ordersTableExpandedRowId,
  transactionsCount,
}) => (
  <ExpandableOrderWrapper
    // Used to target only this button for changing its color on hovering on the table row
    className={'expandableOrdersButton'}
    startIcon={
      <ExpandableOrdersIconWrapper
        display="flex"
        active={rowId === ordersTableExpandedRowId}
      >
        <DownArrowSVG />
      </ExpandableOrdersIconWrapper>
    }
    disableRipple
  >
    <Typography variant="statusCard" fontWeight="600">
      {transactionsCount}
    </Typography>
  </ExpandableOrderWrapper>
);

const ExpandableOrderWrapper = styled(Button)(({ theme }) => ({
  borderRadius: theme.borderRadius.xs,
  border: 'none',
  color: theme.palette.textColor.light,
  backgroundColor: '#293150',

  '&:hover': {
    backgroundColor: '#4C54F5',
    boxShadow: 'none',
    border: 'none',
  },
}));

const ExpandableOrdersIconWrapper = styled(Grid, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  transform: active ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.3s',
  marginTop: '1px',
  marginRight: '5px',
}));

export default ExpandableOrdersButton;
