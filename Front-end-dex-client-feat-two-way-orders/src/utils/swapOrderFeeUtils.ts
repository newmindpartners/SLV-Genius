import { ExpandableItem } from '~/pages/Swap/components/CardExpandable';
import { SwapOrderMakerTotalFeesDeposit, SwapOrderTakerTotalFees } from '~/redux/api';
import { indivisibleToUnit, plus } from '~/utils/mathUtils';
import { defaultAdaPrecision, TradingAsset } from '~/utils/tradingPairsUtils';

import { isAssetADA } from './swapOrderUtils';

export const ADA_UNIT = 'ADA';
const TOTAL_ADA_FEE_LABEL = 'Total ADA Fee';
const DEPOSIT_AMOUNT_LABEL = 'Deposit Amount';
const APPLICATION_FEE_LABEL = 'Application Fee';
const TRANSACTION_FEE_LABEL = 'Transaction Fee';
const APPLICATION_FEE_TOOLTIP =
  "A fee that covers the Genius Yield platform's operational costs. 20% of collected fees are returned to GENS stakers through the Profit Sharing functionality.";
const TRANSACTION_FEE_TOOLTIP =
  'A fee charged by Cardano blockchain to cover the costs of processing the trade and long-term storage of transactions.';
const LIMIT_ORDER_MAKER_FEE_TOOLTIP =
  'Limit order maker fee - 0.3% of the offered token amount';
const NON_LIMIT_ORDER_MAKER_FEE_TOOLTIP =
  'Order taker fee - 0.3% of the asked token amount';
const DEPOSIT_AMOUNT_TOOLTIP =
  'Required deposit for partial fills. This amount will be returned to the user placing a limit order when the order is filled or cancelled.';

const formatFeeValue = (value: string | undefined, precision: number) =>
  value ? indivisibleToUnit(value, precision) : '0';

const getFeeValueOrDefault = (feeAmount: string | undefined) => feeAmount || '0';

export type FormattedFee = {
  previewItem: ExpandableItem;
  collapsedItems?: ExpandableItem[];
};

const createFeeItem = (
  label: string,
  value: string,
  valueUnit: string,
  tooltip?: string,
): FormattedFee => ({
  previewItem: {
    label,
    value: formatFeeValue(value, defaultAdaPrecision),
    valueUnit,
    tooltip,
  },
});

const createCollapsedItems = (
  transactionFee: SwapOrderTakerTotalFees | null,
  applicationFee?: string,
): ExpandableItem[] => [
  {
    label: APPLICATION_FEE_LABEL,
    value: formatFeeValue(
      applicationFee || transactionFee?.takerLovelaceFlatFeeAmount,
      defaultAdaPrecision,
    ),
    valueUnit: ADA_UNIT,
    tooltip: APPLICATION_FEE_TOOLTIP,
  },
  {
    label: TRANSACTION_FEE_LABEL,
    value: formatFeeValue(transactionFee?.transactionFeeAmount, defaultAdaPrecision),
    valueUnit: ADA_UNIT,
    tooltip: TRANSACTION_FEE_TOOLTIP,
  },
];

const calculateTotalAdaFee = (
  transactionFee: (SwapOrderMakerTotalFeesDeposit & SwapOrderTakerTotalFees) | null,
  fromAssetShortName: string | undefined,
) => {
  const transactionTotalFeesAmount = getFeeValueOrDefault(
    transactionFee?.transactionTotalFeesAmount,
  );
  const makerFromAssetFeeAmount =
    fromAssetShortName && isAssetADA(fromAssetShortName)
      ? getFeeValueOrDefault(transactionFee?.makerFromAssetFeeAmount)
      : '0';

  return plus(transactionTotalFeesAmount, makerFromAssetFeeAmount);
};

const calculateMakerApplicationFee = (
  transactionFee: (SwapOrderMakerTotalFeesDeposit & SwapOrderTakerTotalFees) | null,
  fromAssetShortName: string | undefined,
) => {
  const makerLovelaceFlatFeeAmount = getFeeValueOrDefault(
    transactionFee?.makerLovelaceFlatFeeAmount,
  );
  const takerLovelaceFlatFeeAmount = getFeeValueOrDefault(
    transactionFee?.takerLovelaceFlatFeeAmount,
  );
  const makerFromAssetFeeAmount =
    fromAssetShortName && isAssetADA(fromAssetShortName)
      ? getFeeValueOrDefault(transactionFee?.makerFromAssetFeeAmount)
      : '0';

  return plus(
    makerLovelaceFlatFeeAmount,
    takerLovelaceFlatFeeAmount,
    makerFromAssetFeeAmount,
  );
};

const calculateTakerApplicationFee = (
  transactionFee: (SwapOrderMakerTotalFeesDeposit & SwapOrderTakerTotalFees) | null,
  fromAssetShortName: string | undefined,
) => {
  const takerFromAssetFeeAmount =
    fromAssetShortName && isAssetADA(fromAssetShortName)
      ? getFeeValueOrDefault(transactionFee?.takerFromAssetFeeAmount)
      : '0';

  const takerLovelaceFlatFeeAmount = getFeeValueOrDefault(
    transactionFee?.takerLovelaceFlatFeeAmount,
  );

  return plus(takerFromAssetFeeAmount, takerLovelaceFlatFeeAmount);
};

const createMakerNonAdaFeeItem = (
  transactionFee: (SwapOrderMakerTotalFeesDeposit & SwapOrderTakerTotalFees) | null,
  fromAsset: TradingAsset | null,
) =>
  fromAsset?.shortName && !isAssetADA(fromAsset?.shortName)
    ? [
        {
          previewItem: {
            label: `Total ${fromAsset?.shortName} Fee`,
            value: formatFeeValue(
              transactionFee?.makerFromAssetFeeAmount,
              fromAsset.decimalPrecision,
            ),
            valueUnit: fromAsset.shortName,
            tooltip: LIMIT_ORDER_MAKER_FEE_TOOLTIP,
          },
        },
      ]
    : [];

const createTakerNonAdaFeeItem = (
  transactionFee: (SwapOrderMakerTotalFeesDeposit & SwapOrderTakerTotalFees) | null,
  fromAssetShortName: string | undefined,
) =>
  fromAssetShortName && !isAssetADA(fromAssetShortName)
    ? [
        {
          previewItem: {
            label: `Total ${fromAssetShortName} Fee`,
            value: formatFeeValue(
              transactionFee?.takerFromAssetFeeAmount,
              defaultAdaPrecision,
            ),
            valueUnit: fromAssetShortName,
            tooltip: NON_LIMIT_ORDER_MAKER_FEE_TOOLTIP,
          },
        },
      ]
    : [];

export const formatLimitOrderFee = (
  transactionFee: (SwapOrderMakerTotalFeesDeposit & SwapOrderTakerTotalFees) | null,
  fromAsset: TradingAsset | null,
): FormattedFee[] => {
  const totalAdaFee = transactionFee
    ? calculateTotalAdaFee(transactionFee, fromAsset?.shortName)
    : '0';
  const applicationFee = transactionFee
    ? calculateMakerApplicationFee(transactionFee, fromAsset?.shortName)
    : '0';
  const depositAmountFee = transactionFee?.depositAmount || '0';

  const fees = [
    {
      ...createFeeItem(TOTAL_ADA_FEE_LABEL, totalAdaFee, ADA_UNIT),
      collapsedItems: createCollapsedItems(transactionFee, applicationFee),
    },
    ...createMakerNonAdaFeeItem(transactionFee, fromAsset),
    {
      ...createFeeItem(
        DEPOSIT_AMOUNT_LABEL,
        depositAmountFee,
        ADA_UNIT,
        DEPOSIT_AMOUNT_TOOLTIP,
      ),
    },
  ];

  return fees;
};

export const formatBestAvailableOrderFee = (
  transactionFee: SwapOrderTakerTotalFees | null,
  fromAssetShortName: string | undefined,
): FormattedFee[] => formatFillOrderFee(transactionFee, fromAssetShortName);

export const formatFillOrderFee = (
  transactionFee: SwapOrderTakerTotalFees | null,
  fromAssetShortName: string | undefined,
): FormattedFee[] => {
  const totalAdaFee =
    fromAssetShortName && isAssetADA(fromAssetShortName)
      ? plus(
          getFeeValueOrDefault(transactionFee?.transactionTotalFeesAmount),
          transactionFee?.takerFromAssetFeeAmount ?? '0',
        )
      : getFeeValueOrDefault(transactionFee?.transactionTotalFeesAmount);

  const applicationFee = transactionFee
    ? calculateTakerApplicationFee(transactionFee, fromAssetShortName)
    : '0';

  return [
    {
      ...createFeeItem(TOTAL_ADA_FEE_LABEL, totalAdaFee, ADA_UNIT),
      collapsedItems: createCollapsedItems(transactionFee, applicationFee),
    },
    ...createTakerNonAdaFeeItem(transactionFee, fromAssetShortName),
  ];
};
