import { Grid, styled, Typography } from '@mui/material';
import { memo } from 'react';
import { CloseIcon } from '~/components/Icons/Icons';

import { ActionButton } from './OrderBookOrdersTableRow';

type ExpandOrderButtonProps = {
  isExpanded: boolean;
  actionText: string;
  handleToggle: () => void;
};

const ExpandOrderBookRowButton = ({
  isExpanded,
  actionText,
  handleToggle,
}: ExpandOrderButtonProps) => (
  <ExpandActionWrapper>
    <ActionButton
      disableRipple
      onClick={handleToggle}
      sx={{
        width: isExpanded ? '32px' : '64px !important',
      }}
    >
      <Typography variant="statusCard" color="soldOutColorStatus.main" fontWeight="600">
        {isExpanded ? <CloseIcon /> : actionText}
      </Typography>
    </ActionButton>
  </ExpandActionWrapper>
);

const ExpandActionWrapper = styled(Grid)({
  '& button': {
    minWidth: 'auto',
    width: 'auto',
    padding: '10px 8px',
  },
});

export default memo(ExpandOrderBookRowButton);
