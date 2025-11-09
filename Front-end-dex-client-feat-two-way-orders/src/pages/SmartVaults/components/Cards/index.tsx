import { Grid, Skeleton, styled } from '@mui/material';
import React, { FC } from 'react';
import NoChartResults from '~/pages/Swap/components/MarketData/NoChartResults';
import { SmartVaultListResult } from '~/redux/api';

import SmartVaultCard from '../Card';

interface Props {
  isSmartVaultsLoading: boolean;
  isSmartVaultsError: boolean;
  smartVaults?: SmartVaultListResult;
  handleWithdrawDialogOpen: (smartVaultId: string) => (e: React.MouseEvent) => void;
  handleDepositDialogOpen: (smartVaultId: string) => (e: React.MouseEvent) => void;
}

const Cards: FC<Props> = ({
  isSmartVaultsLoading,
  isSmartVaultsError,
  smartVaults,
  handleWithdrawDialogOpen,
  handleDepositDialogOpen,
}) => {
  const isShowingSkeleton = isSmartVaultsLoading;
  const isShowingError = isSmartVaultsError;
  const isShowingEmptyCase =
    !isSmartVaultsLoading && !isSmartVaultsError && smartVaults?.results?.length === 0;
  const isShowingSmartVaults =
    !isSmartVaultsLoading &&
    !isSmartVaultsError &&
    smartVaults?.results &&
    smartVaults?.results?.length > 0;

  return (
    <>
      {isShowingSkeleton && <Skeleton />}
      {isShowingError && (
        <NoChartResults
          title="Error Loading Smart Vaults"
          description="There was an error loading your Smart Vaults. Please try again later."
        />
      )}
      {isShowingEmptyCase && (
        <NoChartResults
          title="No Smart Vaults"
          description="You do not have any Smart Vaults yet. Create a new one to see your vaults."
        />
      )}
      {isShowingSmartVaults && (
        <CardsWrapper>
          {smartVaults?.results.map((smartVault) => (
            <SmartVaultCard
              key={smartVault.smartVaultId}
              handleWithdrawClick={handleWithdrawDialogOpen(smartVault.smartVaultId)}
              handleDepositClick={handleDepositDialogOpen(smartVault.smartVaultId)}
              {...smartVault}
            />
          ))}
        </CardsWrapper>
      )}
    </>
  );
};

const CardsWrapper = styled(Grid)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexWrap: 'wrap',
  gap: '16.5px',

  '& > div': {
    width: 'calc(33% - 8px)',
  },

  [theme.breakpoints.down('lg')]: {
    '& > div': {
      width: 'calc(50% - 10px)',
    },
  },
}));

export default Cards;
