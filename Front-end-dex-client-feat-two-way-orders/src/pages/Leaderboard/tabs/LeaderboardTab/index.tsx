import { Grid, Stack, styled, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '~/components/Alert';
import Button from '~/components/Button/Button';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { useWallet } from '~/hooks/wallet/wallet';
import { TradingWalletSortByOptions, useListTradingWalletsQuery } from '~/redux/api';

import { DataPlaceholder } from '../../components/DataPlaceholder';
import { TablePagination } from '../../components/TablePagination';
import { TradingWalletGrid } from '../../components/TradingWalletGrid';
import { TradingWalletTable } from '../../components/TradingWalletTable';
import { botsDataTooltip } from '../../constants';

export interface LeaderboardTabProps {
  onRegisterBot: () => void;
}

export const LeaderboardTab = ({ onRegisterBot }: LeaderboardTabProps) => {
  const navigate = useNavigate();
  const { isWalletConnected } = useWallet();

  const [cursor, setCursor] = useState<string | null>(null);

  const sortTradingWalletOrderBy: TradingWalletSortByOptions = '-roiPercent';

  const {
    data: tradingWalletsData,
    isLoading: isLoadingTradingWallets,
    isFetching: isFetchingTradingWallets,
    isError: isErrorTradingWallets,
  } = useListTradingWalletsQuery({
    cursor: cursor ?? undefined,
    sortTradingWalletOrderBy,
  });

  const {
    data: featuredTradingWalletsData,
    isLoading: isLoadingFeaturedTradingWallets,
    isError: isErrorFeaturedTradingWallets,
  } = useListTradingWalletsQuery({
    count: 3,
    sortTradingWalletOrderBy,
  });

  const tradingWallets = tradingWalletsData?.results ?? [];
  const featuredTradingWallets = featuredTradingWalletsData?.results ?? [];

  const isNoFeaturedTradingWallets =
    featuredTradingWalletsData && !featuredTradingWalletsData.results.length;

  const isNoTradingWallets = tradingWalletsData && !tradingWalletsData.results.length;

  const handleViewTradingWallet = useCallback((id: string) => {
    navigate(`/bot/${id}`);
    window.scrollTo(0, 0);
  }, []);

  if (isNoFeaturedTradingWallets || isNoTradingWallets) {
    return (
      <DataPlaceholder
        title="No bots registered yet"
        subtitle="Click the button below to register the first!"
      >
        {isWalletConnected ? (
          <Button
            color="gradient"
            sx={{ fontWeight: 'bold', px: 4, zIndex: 1 }}
            onClick={onRegisterBot}
          >
            Register Bot
          </Button>
        ) : (
          <ConnectWalletButtonDialog
            label="Connect Your Wallet"
            size="medium"
            showWalletAddressIfConnected={false}
          />
        )}
      </DataPlaceholder>
    );
  }

  return (
    <LeaderboardTab.Wrapper>
      {!isErrorFeaturedTradingWallets ? (
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Featured Bots</Typography>
          </Stack>

          <TradingWalletGrid
            showPlace
            tradingWallets={featuredTradingWallets}
            skeletonCount={3}
            isLoading={isLoadingFeaturedTradingWallets}
            onViewTradingWallet={handleViewTradingWallet}
          />
        </Stack>
      ) : (
        <Alert severity="error">
          We apologize, but there was an error retrieving the featured bots data, our team
          is working to resolve this issue soon
        </Alert>
      )}

      {!isErrorTradingWallets ? (
        <Stack spacing={2}>
          <Grid container gap="10px" alignItems="center">
            <Typography variant="h6">Leaderboard</Typography>

            <Tooltip title={botsDataTooltip}>
              <Grid mt="5px">
                <InfoIcon />
              </Grid>
            </Tooltip>
          </Grid>

          <TradingWalletTable
            tradingWallets={tradingWallets}
            isLoading={isLoadingTradingWallets}
            onViewTradingWallet={handleViewTradingWallet}
          />
          <TablePagination
            isPrevPageDisabled={!tradingWalletsData?.previous}
            isNextPageDisabled={!tradingWalletsData?.next}
            isPrevPageLoading={
              cursor === tradingWalletsData?.previous && isFetchingTradingWallets
            }
            isNextPageLoading={
              cursor === tradingWalletsData?.next && isFetchingTradingWallets
            }
            onPrevPage={() => setCursor(tradingWalletsData?.previous ?? null)}
            onNextPage={() => setCursor(tradingWalletsData?.next ?? null)}
          />
        </Stack>
      ) : (
        <Alert severity="error">
          We apologize, but there was an error retrieving the leaderboard data, our team
          is working to resolve this issue soon.
        </Alert>
      )}
    </LeaderboardTab.Wrapper>
  );
};

LeaderboardTab.Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
  flex: 1;
`;
