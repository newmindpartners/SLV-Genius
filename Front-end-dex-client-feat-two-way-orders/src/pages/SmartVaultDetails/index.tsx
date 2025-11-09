import { styled } from '@mui/material';
import CancelOrderDialogProvider from '~/context/cancelOrderDialog';
import TradingPairsContextProvider from '~/context/tradingPairsContext';

import PageContent from './PageContent';

export const SmartVaultDetails = () => {
  return (
    <CancelOrderDialogProvider>
      <TradingPairsContextProvider>
        <PageContent />
      </TradingPairsContextProvider>
    </CancelOrderDialogProvider>
  );
};

SmartVaultDetails.OrderControls = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    justify-content: space-between;
  }
`;

SmartVaultDetails.Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;
