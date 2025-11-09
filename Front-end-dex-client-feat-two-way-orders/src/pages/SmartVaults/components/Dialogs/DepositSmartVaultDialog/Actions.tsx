import { Grid } from '@mui/material';
import { FC } from 'react';
import GreenGradientButton from '~/components/Button/GreenGradientButton';
import NeutralButton from '~/components/Button/NeutralButton';

type ActionsProps = {
  isDisabled: boolean;
  isLoading: boolean;
  onClose: () => void;
  onDeposit: () => void;
};

const Actions: FC<ActionsProps> = ({ isDisabled, isLoading, onClose, onDeposit }) => (
  <Grid display="flex" justifyContent="center" gap="16px">
    <Grid item flex={1}>
      <NeutralButton onClick={onClose}>Cancel</NeutralButton>
    </Grid>
    <Grid item flex={1}>
      <GreenGradientButton
        isDisabled={isDisabled}
        onClick={onDeposit}
        isLoading={isLoading}
      >
        Deposit
      </GreenGradientButton>
    </Grid>
  </Grid>
);

export default Actions;
