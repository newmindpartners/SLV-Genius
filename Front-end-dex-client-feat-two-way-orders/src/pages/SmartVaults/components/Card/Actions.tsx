import { Grid, styled } from '@mui/material';
import { FC } from 'react';
import GreenGradientButton from '~/components/Button/GreenGradientButton';
import RedGradientButton from '~/components/Button/RedGradientButton';
import { SmartVaultOperationListResult } from '~/redux/api';

type SmartVaultCardActions = {
  handleDepositClick: (e: React.MouseEvent) => void;
  handleWithdrawClick: (e: React.MouseEvent) => void;
  operationsData?: SmartVaultOperationListResult;
};

const Actions: FC<SmartVaultCardActions> = ({
  handleDepositClick,
  handleWithdrawClick,
}) => {
  return (
    <Wrapper>
      <GreenGradientButton onClick={handleDepositClick}>Deposit</GreenGradientButton>
      <RedGradientButton onClick={handleWithdrawClick}>
        Withdraw & Close
      </RedGradientButton>
    </Wrapper>
  );
};

const Wrapper = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: 'auto',
}));

export default Actions;
