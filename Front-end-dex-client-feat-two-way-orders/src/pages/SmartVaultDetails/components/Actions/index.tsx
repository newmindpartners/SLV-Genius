import { Grid } from '@mui/material';
import { FC } from 'react';
import GreenGradientButton from '~/components/Button/GreenGradientButton';
import RedGradientButton from '~/components/Button/RedGradientButton';

type ActionsProps = {
  isWithdrawing: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
};

const Actions: FC<ActionsProps> = ({ isWithdrawing, onDeposit, onWithdraw }) => (
  <Grid alignItems="center" gap="10px" display="flex">
    <Grid item minWidth="147px">
      <GreenGradientButton onClick={onDeposit}>Deposit</GreenGradientButton>
    </Grid>
    <Grid item minWidth="147px">
      <RedGradientButton onClick={onWithdraw} isLoading={isWithdrawing}>
        Withdraw & Close
      </RedGradientButton>
    </Grid>
  </Grid>
);

export default Actions;
