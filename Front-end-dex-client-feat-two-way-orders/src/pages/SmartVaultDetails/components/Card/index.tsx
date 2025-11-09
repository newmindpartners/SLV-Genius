import { Grid, Stack, styled, Typography } from '@mui/material';
import { useState } from 'react';
import { Card as CustomCard } from '~/components/Card';
import { StatTypography } from '~/components/StatTypography';
import DepositSmartVaultDialog from '~/pages/SmartVaults/components/Dialogs/DepositSmartVaultDialog';
import WithdrawSmartVaultsDialog from '~/pages/SmartVaults/components/Dialogs/WithdrawSmartVaultsDialog';
import { SmartVault } from '~/redux/api';
import { formatDate } from '~/utils/dateUtils';

import Actions from '../Actions';
import AssetItem from '../AssetItem';

interface SmartVaultsDetails {
  smartVaultId: string;
  smartVault: SmartVault | undefined;
}

const Card = ({ smartVaultId, smartVault }: SmartVaultsDetails) => {
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState<boolean>(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState<boolean>(false);

  const handleWithdrawDialogClose = () => setIsWithdrawDialogOpen(false);
  const handleDepositDialogClose = () => setIsDepositDialogOpen(false);

  const handleWithdrawDialogOpen = () => setIsWithdrawDialogOpen(true);
  const handleDepositDialogOpen = () => setIsDepositDialogOpen(true);

  return (
    <Card.Wrapper>
      <Card.Header>
        <Typography variant="h3">Smart Vault Details</Typography>
        <Actions
          onWithdraw={handleWithdrawDialogOpen}
          onDeposit={handleDepositDialogOpen}
          isWithdrawing={false}
        />
      </Card.Header>

      <Grid display="flex" flexDirection="column" gap="9px" wrap="wrap">
        <Typography color="#C1CEF1" fontSize="15px" fontWeight="400">
          Locked Assets:
        </Typography>
        <Grid display="flex" gap="25px">
          {smartVault?.depositedAssets?.map((asset, i) => (
            <AssetItem {...asset} key={i} />
          ))}
        </Grid>
      </Grid>

      <Card.StatGrid>
        <StatTypography label="ROI">-</StatTypography>
        <StatTypography label="Strategy">
          {smartVault?.smartVaultStrategy?.name || '-'}
        </StatTypography>
        <StatTypography label="Created">
          {smartVault ? formatDate(new Date(smartVault.created)) : '-'}
        </StatTypography>
        <StatTypography label="TVL" display="flex" gap="3px">
          -<Typography>-</Typography>
        </StatTypography>
        <StatTypography label="APY boost">-</StatTypography>
      </Card.StatGrid>

      <WithdrawSmartVaultsDialog
        open={isWithdrawDialogOpen}
        smartVaultId={smartVaultId}
        onClose={handleWithdrawDialogClose}
        refetchSmartVaults={() => {}}
      />

      <DepositSmartVaultDialog
        open={isDepositDialogOpen}
        smartVaultId={smartVaultId}
        onClose={handleDepositDialogClose}
        refetchSmartVaults={() => {}}
      />
    </Card.Wrapper>
  );
};

Card.StatGrid = styled(Stack)`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(5)};
  width: 100%;
`;

Card.Header = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

Card.Wrapper = styled(CustomCard)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(3)};
`;

export default Card;
