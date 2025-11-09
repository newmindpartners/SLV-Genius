import { Grid, styled } from '@mui/material';
import { useState } from 'react';
import { useWallet } from '~/hooks/wallet/wallet';
import DepositSmartVaultDialog, {
  DepositDialogData,
} from '~/pages/SmartVaults/components/Dialogs/DepositSmartVaultDialog';
import WithdrawSmartVaultsDialog from '~/pages/SmartVaults/components/Dialogs/WithdrawSmartVaultsDialog';
import { Asset, SmartVaultWithdrawData, useListSmartVaultsQuery } from '~/redux/api';

import { WalletConnectBanner } from '../Earn';
import Cards from './components/Cards';
import CreateSmartVaultCard from './components/CreateCard/Card';

export type SmartVaultsDataAsset = Asset | null;

const PageContent = () => {
  const { walletStakeKeyHash, isWalletConnected } = useWallet();

  const [withdrawDialogData, setWithdrawDialogData] = useState<Pick<
    SmartVaultWithdrawData,
    'smartVaultId'
  > | null>(null);
  const [depositDialogData, setDepositDialogData] = useState<DepositDialogData | null>(
    null,
  );

  const {
    data: smartVaults,
    isLoading: isSmartVaultsLoading,
    isError: isSmartVaultsError,
    refetch,
  } = useListSmartVaultsQuery(
    {
      filterByWalletStakeKeyHash: walletStakeKeyHash,
    },
    {
      skip: !isWalletConnected,
    },
  );

  const refetchSmartVaults = () => {
    refetch();
  };

  const handleWithdrawDialogClose = () => setWithdrawDialogData(null);
  const handleDepositDialogClose = () => setDepositDialogData(null);

  const handleWithdrawDialogOpen = (smartVaultId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setWithdrawDialogData({ smartVaultId });
  };
  const handleDepositDialogOpen = (smartVaultId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setDepositDialogData({ smartVaultId });
  };

  return (
    <Grid display="flex">
      <Content container gap="40px" alignItems="start" wrap="nowrap">
        <Left>
          <CreateSmartVaultCard refetchSmartVaults={refetchSmartVaults} />
        </Left>

        <Right>
          {isWalletConnected ? (
            <Cards
              isSmartVaultsLoading={isSmartVaultsLoading}
              isSmartVaultsError={isSmartVaultsError}
              smartVaults={smartVaults}
              handleWithdrawDialogOpen={handleWithdrawDialogOpen}
              handleDepositDialogOpen={handleDepositDialogOpen}
            />
          ) : (
            <WalletConnectBanner
              collapse={!isWalletConnected}
              sx={{ overflow: 'hidden', padding: '45px 115px' }}
              turnOffFeatures
            />
          )}
        </Right>

        {withdrawDialogData && (
          <WithdrawSmartVaultsDialog
            open={!!withdrawDialogData}
            smartVaultId={withdrawDialogData.smartVaultId}
            onClose={handleWithdrawDialogClose}
            refetchSmartVaults={refetchSmartVaults}
          />
        )}

        {depositDialogData && (
          <DepositSmartVaultDialog
            open={!!depositDialogData}
            smartVaultId={depositDialogData.smartVaultId}
            onClose={handleDepositDialogClose}
            refetchSmartVaults={refetchSmartVaults}
          />
        )}
      </Content>
    </Grid>
  );
};

const Content = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: 40,
  },

  [theme.breakpoints.down('sm')]: {
    '& > div': {
      flex: 1,
      width: '100%',
    },
  },
}));

const Left = styled(Grid)(({ theme }) => ({
  display: 'flex',
  background: '#171D2D',
  borderRadius: theme.borderRadius.md,
  width: 'fit-content',

  position: 'sticky',
  top: 24,
}));

const Right = styled(Grid)({
  flexGrow: '1',
  display: 'flex',
  width: '100%',
  height: '100%',
});

export default PageContent;
