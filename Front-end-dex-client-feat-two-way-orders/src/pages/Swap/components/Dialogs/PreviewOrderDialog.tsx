import { Grid, styled } from '@mui/material';
import { FC } from 'react';
import GreenGradientButton from '~/components/Button/GreenGradientButton';
import BlurryDialog from '~/components/Dialogs/Dialog/BlurryDialog';
import { AdvancedSettings } from '~/context/advancedSettingsContext';
import { Asset } from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import { formatDateWithTime } from '~/utils/dateUtils';
import { FormattedFee } from '~/utils/swapOrderFeeUtils';
import { TradingPairAmounts } from '~/utils/tradingPairsUtils';

import OrderFees from '../OrderFees/OrderFees';
import PreviewOrderAssetCard from '../PreviewOrderAssetCard';
import { Field } from './CancelOrderDialog';

type OrderPayload = {
  advancedSettings?: AdvancedSettings;
  selectedAssets: {
    from: Asset | null;
    to: Asset | null;
  };
  tradingPairAmounts: TradingPairAmounts;
  fiatAmounts?: TradingPairAmounts;
  priceFormatted: string;
  orderId?: string;
  isLoadingFee: boolean;
  fee: FormattedFee[];
  onSubmit: () => void;
  isLoadingSubmission?: boolean;
  orderTypeLabel: string;
};

export type ConfirmationSwapOrderData = {
  payload: OrderPayload;
  transactionType: TransactionEndpoints;
};

export type PreviewOrderDialogProps = ConfirmationSwapOrderData & {
  onClose: () => void;
};

const PreviewOrderDialog: FC<PreviewOrderDialogProps> = ({ payload, onClose }) => {
  const {
    advancedSettings,
    selectedAssets,
    tradingPairAmounts,
    fiatAmounts,
    priceFormatted,
    fee,
    isLoadingFee,
    orderTypeLabel,
    onSubmit,
    isLoadingSubmission,
  } = payload;

  return (
    <BlurryDialog
      title="Preview"
      onClose={onClose}
      actions={
        <GreenGradientButton onClick={onSubmit} isLoading={isLoadingSubmission}>
          Place Order
        </GreenGradientButton>
      }
    >
      <PreviewContent
        selectedAssets={selectedAssets}
        tradingPairAmounts={tradingPairAmounts}
        priceFormatted={priceFormatted}
        advancedSettings={advancedSettings}
        fromSecondaryAmount={fiatAmounts?.from ? fiatAmounts.from : ''}
        toSecondaryAmount={fiatAmounts?.to ? fiatAmounts.to : ''}
        fee={fee}
        orderTypeLabel={orderTypeLabel}
        isLoadingFee={isLoadingFee}
      />
    </BlurryDialog>
  );
};

type PreviewContentProps = {
  orderTypeLabel: string;
  selectedAssets: {
    from: Asset | null;
    to: Asset | null;
  };
  tradingPairAmounts: TradingPairAmounts;
  priceFormatted: string;
  fromSecondaryAmount: string;
  toSecondaryAmount: string;
  advancedSettings?: AdvancedSettings;
  isLoadingFee: boolean;
  fee: FormattedFee[];
};

const PreviewContent = ({
  orderTypeLabel,
  selectedAssets,
  tradingPairAmounts,
  priceFormatted,
  fromSecondaryAmount,
  toSecondaryAmount,
  advancedSettings,
  fee,
  isLoadingFee,
}: PreviewContentProps) => (
  <Grid container marginTop="35px" width="350px" marginBottom="20px">
    <Grid
      container
      flexDirection="row"
      position="relative"
      paddingBottom="40px"
      marginBottom="30px"
    >
      {selectedAssets.from && (
        <PreviewOrderAssetCard
          label={`From ${selectedAssets.from?.shortName}:`}
          asset={selectedAssets.from}
          amount={tradingPairAmounts.from ? tradingPairAmounts.from : ''}
          secondaryAmount={fromSecondaryAmount}
        />
      )}

      {selectedAssets.to && (
        <PreviewOrderAssetCard
          label={`To ${selectedAssets.to?.shortName}:`}
          asset={selectedAssets.to}
          amount={tradingPairAmounts.to ? tradingPairAmounts.to : ''}
          secondaryAmount={toSecondaryAmount}
        />
      )}

      <LineStroke />
    </Grid>

    <FieldsWrapper container direction="column">
      <Field label={'Type'} content={orderTypeLabel} />
      <Field label={'Price'} content={priceFormatted} />

      {advancedSettings?.startDate && (
        <Field
          label={'Start Date'}
          content={formatDateWithTime(advancedSettings.startDate)}
        />
      )}

      {advancedSettings?.endDate && (
        <Field
          label={'End Date'}
          content={formatDateWithTime(advancedSettings.endDate)}
        />
      )}
    </FieldsWrapper>

    <OrderFees fee={fee} isLoadingFee={isLoadingFee} />
  </Grid>
);

const FieldsWrapper = styled(Grid)({
  marginTop: '10px',
  marginBottom: '30px',
  rowGap: '10px',
});

const LineStroke = styled(Grid)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '2px',
  left: '0px',
  bottom: '0px',
  background: theme.palette.highlightedFrames.main,
}));

export default PreviewOrderDialog;
