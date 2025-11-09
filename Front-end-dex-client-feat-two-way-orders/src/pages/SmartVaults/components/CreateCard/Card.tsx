import { Grid, styled, Typography } from '@mui/material';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import GreenGradientButton from '~/components/Button/GreenGradientButton';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { useWallet } from '~/hooks/wallet/wallet';
import PreviewSmartVaultsDialog from '~/pages/SmartVaults/components/Dialogs/PreviewSmartVaultsDialog';
import { PreviewDialogProps } from '~/pages/SmartVaults/components/Dialogs/PreviewSmartVaultsDialog';
import {
  Asset,
  SmartVaultStrategy,
  useListSmartVaultStrategiesQuery,
} from '~/redux/api/core';

import OrderFees from '../../../Swap/components/OrderFees/OrderFees';
import { mockFees } from '../../mocks';
import { SmartVaultsDataAsset } from '../../PageContent';
import Skeleton from '../../Skeleton';
import CardContent from './CardContent';

export type SmartVaultAssetData = {
  asset: SmartVaultsDataAsset;
  price: string;
};

export type SmartVaultsData = {
  assets: SmartVaultAssetData[];
  selectedStrategy: SmartVaultStrategy | null;
};

interface Props {
  refetchSmartVaults: () => void;
}

const Card = ({ refetchSmartVaults }: Props): ReactElement => {
  const { data: strategies, isLoading: isLoadingStrategies } =
    useListSmartVaultStrategiesQuery();

  const { tradingAssets, isLoadingTradingAssets } = useTradingPairs();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewDialogProps, setPreviewDialogProps] = useState<PreviewDialogProps | null>(
    null,
  );

  const handlePreviewDialogOpen = () => {
    const lockedAssets = smartVaultData.assets.map((asset) => ({
      // TODO: Fix, perhaps we  need to rethink types here
      assetId: asset.asset?.assetId || '',
      asset: asset.asset as Asset,
      assetAmount: asset.price,
    }));

    setPreviewDialogProps({
      open: true,
      isLoadingFees: false,
      fees: fees.slice(0, 1),
      lockedAssets,
      strategy: smartVaultData.selectedStrategy,
      onClose: handlePreviewDialogClose,
      refetchSmartVaults,
    });

    setPreviewDialogOpen(true);
  };

  const handlePreviewDialogClose = () => setPreviewDialogOpen(false);

  const handleSubmit = () => {};

  const [smartVaultData, setSmartVaultData] = useState<SmartVaultsData>({
    assets: [],
    selectedStrategy: null,
  });

  const isSubmitOrderDisabled =
    !smartVaultData.selectedStrategy ||
    smartVaultData.assets.some((asset) => !asset.asset || !asset.price) ||
    smartVaultData.assets.length !==
      smartVaultData.selectedStrategy.numberOfAssetsSupported;

  const isLoading = isLoadingTradingAssets || isLoadingStrategies;
  const fees = mockFees;

  const handleChangeField = <K extends keyof SmartVaultsData>(
    key: K,
    value: SmartVaultsData[K],
  ) => {
    setSmartVaultData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const filteredStrategies = strategies?.filter(
    (strategy) => strategy.numberOfAssetsSupported > 1,
  );

  useEffect(() => {
    if (strategies && tradingAssets && !smartVaultData.assets.length) {
      const adaAsset = tradingAssets.find((asset) => asset.shortName === 'ADA');
      const gensAsset = tradingAssets.find((asset) => asset.shortName === 'GENS');

      if (adaAsset && gensAsset) {
        setSmartVaultData({
          selectedStrategy: null,
          assets: [
            { asset: adaAsset, price: '' },
            { asset: gensAsset, price: '' },
          ],
        });
      }
    }
  }, [strategies, tradingAssets]);

  return (
    <OrderWrapper>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Grid>
              <CardHeading />
              <CardContent
                assets={smartVaultData.assets}
                strategy={smartVaultData.selectedStrategy}
                strategies={filteredStrategies}
                onChangeAssets={(newAssets) => handleChangeField('assets', newAssets)}
                tradingAssets={tradingAssets}
                smartVaultData={smartVaultData}
                setSmartVaultData={setSmartVaultData}
              />
              <ActionBlock>
                <OrderFees isLoadingFee={false} fee={fees} />
                <PlaceOrderButton
                  disabled={isSubmitOrderDisabled}
                  onPlaceOrder={handlePreviewDialogOpen}
                >
                  Place Order
                </PlaceOrderButton>
              </ActionBlock>
            </Grid>
          </form>

          {previewDialogOpen && previewDialogProps && (
            <PreviewSmartVaultsDialog {...previewDialogProps} />
          )}
        </>
      )}
    </OrderWrapper>
  );
};

const CardHeading = () => (
  <HeadingWrapper>
    <Title>Create Smart Vault</Title>
    <Tooltip
      disableInteractive
      title={
        `Select two tokens that you'd like to trade and enter the amount.\n` +
        `“From” - tokens that you'd like to sell.\n` +
        `“To” - tokens that you'd like to buy.\n` +
        `Confirm the trade by clicking the “Place Order” button.`
      }
    >
      <Info>
        <div>How it works</div>
        <InfoIcon />
      </Info>
    </Tooltip>
  </HeadingWrapper>
);

export const PlaceOrderButton = ({
  children,
  disabled,
  onPlaceOrder,
}: {
  children: ReactNode;
  disabled: boolean;
  onPlaceOrder: () => void;
}) => {
  const { isWalletConnected } = useWallet();
  return (
    <ButtonWrapper>
      {isWalletConnected ? (
        <GreenGradientButton isDisabled={disabled} onClick={onPlaceOrder}>
          {children}
        </GreenGradientButton>
      ) : (
        <ConnectWalletButtonDialog />
      )}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled(Grid)({
  button: {
    width: '100%',
    marginTop: '15px',
  },
});

export const ActionBlock = styled(Grid)(({ theme }) => ({
  padding: '0px 28px 28px',

  [theme.breakpoints.down('sm')]: {
    padding: '0px 20px 40px',
  },

  '.MuiButton-root:disabled': {
    backgroundColor: '#28304E',

    padding: '16px',
    cursor: 'not-allowed',
    pointerEvents: 'all',

    span: {
      color: '#414A70',
    },

    '&:hover': {
      boxShadow: 'unset',
      backgroundColor: '#28304E',
    },
  },
}));

const OrderWrapper = styled(Grid)(({ theme }) => ({
  width: '415px',
  maxWidth: '100%',
  fontFamily: 'Mulish',

  '& > form > div': {
    padding: '0',
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: '#202740',
    boxShadow: 'none',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: 800,
  fontSize: '20px',
  lineHeight: '24px',
  display: 'flex',
  alignItems: 'flex-end',
  color: '#FFFFFF',
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    lineHeight: '24px',
  },
}));

const HeadingWrapper = styled(Grid)(({ theme }) => ({
  padding: '20px 28px',
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid #323F62',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  },
}));

const Info = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: '8px',
  fontWeight: '500',
  fontSize: '12px',
  lineHeight: '16px',
  color: theme.palette.grey[100],

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: '16px',
  },
}));

export default Card;
