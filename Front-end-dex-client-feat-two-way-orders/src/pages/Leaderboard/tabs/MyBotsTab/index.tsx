import { Grid, Stack, styled, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '~/components/Alert';
import Button from '~/components/Button/Button';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { useWallet } from '~/hooks/wallet/wallet';
import { useListTradingWalletsQuery } from '~/redux/api';

import { DataPlaceholder } from '../../components/DataPlaceholder';
import { TabSelect } from '../../components/TabSelect';
import { TradingWalletGrid } from '../../components/TradingWalletGrid';
import { TradingWalletTable } from '../../components/TradingWalletTable';
import { botsDataTooltip, tradingWalletsViewOptions } from '../../constants';
import { TradingWalletsView } from '../../types/TradingWalletsView';

export interface MyBotsTabProps {
  onRegisterBot: () => void;
}

export const MyBotsTab = ({ onRegisterBot }: MyBotsTabProps) => {
  const navigate = useNavigate();
  const { walletStakeKeyHash, isWalletConnected } = useWallet();

  const { data, isLoading, error } = useListTradingWalletsQuery({
    filterByWalletStakeKeyHash: walletStakeKeyHash,
    sortTradingWalletOrderBy: '-roiPercent',
  });

  const [tradingWalletsView, setTradingWalletsView] = useState<TradingWalletsView>(
    TradingWalletsView.Cards,
  );

  const tradingWallets = data?.results || [];

  const handleViewTradingWallet = useCallback((id: string) => {
    navigate(`/bot/${id}`);
    window.scrollTo(0, 0);
  }, []);

  const isNoTradingWallets = data && data.results.length === 0;

  const errorFetchingBotsMessage =
    'We apologize, but there was an error retrieving the bots data. Please try again in a moment.';

  if (error) {
    return (
      <DataPlaceholder
        title="Failed to retrieve bots"
        subtitle={errorFetchingBotsMessage}
      />
    );
  }

  if (!isWalletConnected) {
    return (
      <DataPlaceholder
        title="You have to connect wallet to view this page"
        subtitle="Click the button below to connect your wallet"
      >
        <ConnectWalletButtonDialog />
      </DataPlaceholder>
    );
  }

  if (isNoTradingWallets) {
    return (
      <DataPlaceholder
        title="You have no bots registered"
        subtitle="Click the button below to register one"
      >
        <Button color="gradient" sx={{ fontWeight: 'bold' }} onClick={onRegisterBot}>
          Register Bot
        </Button>
      </DataPlaceholder>
    );
  }

  return (
    <MyBotsTab.Wrapper>
      {!error ? (
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Grid container gap="10px" alignItems="center">
              <Typography variant="h6">Bots</Typography>

              <Tooltip title={botsDataTooltip}>
                <Grid mt="5px">
                  <InfoIcon />
                </Grid>
              </Tooltip>
            </Grid>

            <TabSelect
              variant="contained"
              value={tradingWalletsView}
              options={tradingWalletsViewOptions}
              onChange={(value) => setTradingWalletsView(value)}
            />
          </Stack>

          {tradingWalletsView === TradingWalletsView.Cards && (
            <TradingWalletGrid
              tradingWallets={tradingWallets}
              isLoading={isLoading}
              onViewTradingWallet={handleViewTradingWallet}
            />
          )}

          {tradingWalletsView === TradingWalletsView.Table && (
            <TradingWalletTable
              tradingWallets={tradingWallets}
              isLoading={isLoading}
              onViewTradingWallet={handleViewTradingWallet}
            />
          )}
        </Stack>
      ) : (
        <Alert severity="error">{errorFetchingBotsMessage}</Alert>
      )}
    </MyBotsTab.Wrapper>
  );
};

MyBotsTab.Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
  flex: 1;
`;
