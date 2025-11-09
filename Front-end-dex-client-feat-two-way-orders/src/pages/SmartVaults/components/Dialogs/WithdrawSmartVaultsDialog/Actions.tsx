import { Grid } from '@mui/material';
import { FC } from 'react';
import NeutralButton from '~/components/Button/NeutralButton';
import RedGradientButton from '~/components/Button/RedGradientButton';

type ActionsProps = {
  isWithdrawing: boolean;
  onClose: () => void;
  onWithdraw: () => void;
};

const Actions: FC<ActionsProps> = ({ isWithdrawing, onClose, onWithdraw }) => (
  <Grid container justifyContent="center" gap="16px">
    <Grid item flex={1}>
      <NeutralButton onClick={onClose}>Cancel</NeutralButton>
    </Grid>
    <Grid container item flex={1}>
      <RedGradientButton onClick={onWithdraw} isLoading={isWithdrawing}>
        Withdraw & Close
      </RedGradientButton>
    </Grid>
  </Grid>
);

export default Actions;
