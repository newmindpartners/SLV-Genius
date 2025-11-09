import { styled } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { useAlertDialog } from '~/context/alertDialog';
import TradingPairsContextProvider, {
  useTradingPairs,
} from '~/context/tradingPairsContext';
import { useWallet } from '~/hooks/wallet/wallet';
import { useRegisterTradingWalletMutation } from '~/redux/api';
import { IOption } from '~/types/option';
import { parseApiErrorToMessage } from '~/utils/errorHandlingUtils';
import { ADA_ASSET_ID, convertStringToStakeKeyHash } from '~/utils/wallet';

import { Banner } from './components/Banner';
import { TabSelect } from './components/TabSelect';
import { RegisterBotDialog } from './dialogs/RegisterBotDialog';
import { IRegisterBotFormData } from './dialogs/RegisterBotDialog/types/IRegisterBotFormData';
import { getTradingWalletProfile } from './helpers/getTradingWalletProfile';
import { LeaderboardTab } from './tabs/LeaderboardTab';
import { MyBotsTab } from './tabs/MyBotsTab';

export enum PageTab {
  Leaderboard,
  MyBots,
}

export const pageTabOptions: IOption<PageTab>[] = [
  { label: 'Leaderboard', value: PageTab.Leaderboard },
  { label: 'My Bots', value: PageTab.MyBots },
];

const LeaderboardContent = () => {
  const { tradingAssets } = useTradingPairs();
  const { isWalletConnected } = useWallet();
  const { onDialogOpen } = useAlertDialog();

  const [activeTab, setActiveTab] = useState<PageTab>(PageTab.Leaderboard);
  const [isRegisterBotDialogOpen, setIsRegisterBotDialogOpen] = useState(false);
  const [isRegisterBotDialogLoading, setIsRegisterBotDialogLoading] = useState(false);

  const [registerWallet, registerWalletResponse] = useRegisterTradingWalletMutation();

  const adaAsset = useMemo(
    () => tradingAssets.find((asset) => asset.assetId === ADA_ASSET_ID)!,
    [tradingAssets],
  );

  const handleRegisterBot = useCallback(
    async (formData: IRegisterBotFormData) => {
      try {
        setIsRegisterBotDialogLoading(true);

        const stakeKeyHashFromStakeKeyBech32 = convertStringToStakeKeyHash(
          formData.tradingWalletStakeKeyHash,
        );

        if (!stakeKeyHashFromStakeKeyBech32) {
          return onDialogOpen({
            alertType: AlertType.Failure,
            title:
              'Invalid stake key hash format. Must be valid Bech32 or raw hex string.',
          });
        }

        const data = {
          ...formData,
          assetOneId: adaAsset.assetId,
          tradingWalletStakeKeyHash: stakeKeyHashFromStakeKeyBech32,
        };

        const tradingWalletProfile = data && getTradingWalletProfile(data);

        await registerWallet({ registerTradingWallet: data }).unwrap();

        setIsRegisterBotDialogOpen(false);

        onDialogOpen({
          alertType: AlertType.Success,
          title: `Bot ${tradingWalletProfile.name} successfully registered`,
        });
      } finally {
        setIsRegisterBotDialogLoading(false);
      }
    },
    [adaAsset],
  );

  useEffect(() => {
    if (registerWalletResponse.isError) {
      const errorMessage =
        parseApiErrorToMessage(registerWalletResponse.error) || 'Something went wrong...';

      onDialogOpen({
        alertType: AlertType.Failure,
        title: errorMessage,
      });
    }
  }, [registerWalletResponse.isError]);

  return (
    <Sentry.ErrorBoundary>
      <LeaderboardContent.Wrapper>
        <Banner
          onRegisterBot={() => setIsRegisterBotDialogOpen(true)}
          isWalletConnected={isWalletConnected}
        />

        <TabSelect
          variant="underline"
          value={activeTab}
          options={pageTabOptions}
          onChange={(value) => setActiveTab(value)}
        />

        {PageTab.Leaderboard === activeTab && (
          <LeaderboardTab onRegisterBot={() => setIsRegisterBotDialogOpen(true)} />
        )}

        {PageTab.MyBots === activeTab && (
          <MyBotsTab onRegisterBot={() => setIsRegisterBotDialogOpen(true)} />
        )}

        {isRegisterBotDialogOpen && (
          <RegisterBotDialog
            open={isRegisterBotDialogOpen}
            assetOne={adaAsset}
            assetTwoOptions={adaAsset.allowedAssets}
            isLoading={isRegisterBotDialogLoading}
            onRegister={handleRegisterBot}
            onClose={() => setIsRegisterBotDialogOpen(false)}
          />
        )}
      </LeaderboardContent.Wrapper>
    </Sentry.ErrorBoundary>
  );
};

export const Leaderboard = () => (
  <TradingPairsContextProvider>
    <LeaderboardContent />
  </TradingPairsContextProvider>
);

LeaderboardContent.Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;
