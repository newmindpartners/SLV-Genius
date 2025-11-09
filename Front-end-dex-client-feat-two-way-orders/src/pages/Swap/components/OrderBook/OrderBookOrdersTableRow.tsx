import { Grid, styled, TableCell, TableRow, Typography } from '@mui/material';
import { FC, useRef, useState } from 'react';
import Button from '~/components/Button/Button';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import TextField from '~/components/TextField/TextField';
import { useTradingPairs } from '~/context/tradingPairsContext';
import useSwapFillOrder from '~/hooks/swap/order/fill/direct';
import { useWallet } from '~/hooks/wallet/wallet';
import { Asset, SwapOrder } from '~/redux/api';
import {
  div,
  indivisibleToUnit,
  isValidBig,
  round,
  times,
  trimTrailingZeros,
} from '~/utils/mathUtils';
import { clearStringNumericInput } from '~/utils/swapOrderUtils';
import {
  defaultAdaPrecision,
  findTradingPair,
  TradingPairAmounts,
  TradingPairAssets,
} from '~/utils/tradingPairsUtils';

import ExpandOrderBookRowButton from './ExpandOrderBookRowButton';

export enum TradingListType {
  upper = 'upper',
  lower = 'lower',
}

type OrderBookOrdersTableRowProps = {
  tradingListType: TradingListType;
  order: SwapOrder;
  isExpanded: boolean;
  onRowClick: () => void;
};

type FillOrderData = {
  openOrderSwapId: string;

  toAssetId: string;
  fromAssetId: string;

  toAsset: Asset | undefined;
  fromAsset: Asset | undefined;

  effectiveUntilDate: string | undefined;

  basePrice: string;
  quotePrice: string;

  fromAssetAmountRemaining: string | null;
  toAssetAmountRemaining: string | null;
};

const nullishIndivisibleToUnit = (asset: Asset | undefined, amount: string | undefined) =>
  asset?.decimalPrecision != null && amount
    ? indivisibleToUnit(amount, asset.decimalPrecision)
    : null;

const openToFillMapper = ({
  orderId,
  toAsset,
  fromAsset,

  toAssetId,
  fromAssetId,

  toAssetAmount,
  fromAssetAmount,

  effectiveUntilDate,

  fromAssetAmountRemaining,
  toAssetAmountRemaining,
}: SwapOrder): FillOrderData => {
  const toAssetAmountDisplayUnit = indivisibleToUnit(
    toAssetAmount,
    toAsset?.decimalPrecision ?? defaultAdaPrecision,
  );
  const fromAssetAmountDisplayUnit = indivisibleToUnit(
    fromAssetAmount,
    fromAsset?.decimalPrecision ?? defaultAdaPrecision,
  );

  // Price in display units
  // - required as price is displayed in display units
  // - required as price is applied to values in display units
  const quotePrice = div(toAssetAmountDisplayUnit, fromAssetAmountDisplayUnit);
  const basePrice = div(fromAssetAmountDisplayUnit, toAssetAmountDisplayUnit);

  return {
    openOrderSwapId: orderId,

    toAssetId: fromAssetId,
    fromAssetId: toAssetId,

    toAsset: fromAsset,
    fromAsset: toAsset,

    effectiveUntilDate,

    basePrice,
    quotePrice,

    fromAssetAmountRemaining: nullishIndivisibleToUnit(toAsset, toAssetAmountRemaining),
    toAssetAmountRemaining: nullishIndivisibleToUnit(fromAsset, fromAssetAmountRemaining),
  };
};

const OrderBookOrdersTableRow: FC<OrderBookOrdersTableRowProps> = ({
  tradingListType,
  order: openOrder,
  isExpanded,
  onRowClick,
}) => {
  const { isWalletConnected } = useWallet();

  const { tradingPairs, selectedAssets } = useTradingPairs();

  const fillOrderData = openToFillMapper(openOrder);

  const {
    fromAsset,
    toAsset,

    toAssetAmountRemaining,
    fromAssetAmountRemaining,

    basePrice,
    quotePrice,
  } = fillOrderData;

  const priceLabelColor =
    tradingListType === TradingListType.upper ? 'secondary.dark' : '#59EAD0';

  const actionLabelFormatted = tradingListType === TradingListType.upper ? 'Buy' : 'Sell';

  const basePriceFormatted = trimTrailingZeros(round(quotePrice, 6));
  const quotePriceFormatted = trimTrailingZeros(round(basePrice, 6));

  const priceFormatted =
    tradingListType === TradingListType.upper ? basePriceFormatted : quotePriceFormatted;

  const selectedTradingPair = findTradingPair(
    fromAsset || null,
    toAsset || null,
    tradingPairs,
  );
  const priceAsset = selectedTradingPair?.quoteAsset;
  const pricePreviewDialogFormatted = `${priceFormatted} ${priceAsset?.shortName}`;

  const amount =
    tradingListType === TradingListType.upper
      ? toAssetAmountRemaining
      : fromAssetAmountRemaining;

  const expandedRowRef = useRef<HTMLTableRowElement | null>(null);

  const handleRowClickExpandAndScroll = () => {
    onRowClick();

    setTimeout(() => {
      expandedRowRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 100);
  };

  return (
    <>
      <TableRowStyled isExpanded={isExpanded} onClick={handleRowClickExpandAndScroll}>
        <FirstCell scope="row" align="left">
          <Typography variant="statusCard" color="textColor.main" fontWeight="600">
            {amount}
          </Typography>
        </FirstCell>

        <ResponsiveTableCell scope="row" align="left">
          <Typography variant="statusCard" color={priceLabelColor}>
            {priceFormatted}
          </Typography>
        </ResponsiveTableCell>

        <LastCell scope="row" align="right">
          {isWalletConnected ? (
            <ExpandOrderBookRowButton
              isExpanded={isExpanded}
              actionText={actionLabelFormatted}
              handleToggle={handleRowClickExpandAndScroll}
            />
          ) : (
            <ConnectWalletButtonDialog />
          )}
        </LastCell>
      </TableRowStyled>

      {isExpanded && (
        <ExpandedOrderBookOrderRow
          pricePreviewDialogFormatted={pricePreviewDialogFormatted}
          tradingListType={tradingListType}
          isOrderExpanded={isExpanded}
          selectedAssets={selectedAssets}
          fillOrderData={fillOrderData}
          handleToggleExpandOrder={handleRowClickExpandAndScroll}
          expandedRowRef={expandedRowRef}
        />
      )}
    </>
  );
};

type ExpandedOrderBookOrderRowProps = {
  isOrderExpanded: boolean;
  selectedAssets: TradingPairAssets;
  fillOrderData: FillOrderData;
  pricePreviewDialogFormatted: string;
  tradingListType: TradingListType;
  handleToggleExpandOrder: () => void;
  expandedRowRef: React.MutableRefObject<HTMLTableRowElement | null>;
};

const ExpandedOrderBookOrderRow = ({
  tradingListType,
  fillOrderData,
  isOrderExpanded,
  pricePreviewDialogFormatted,
  handleToggleExpandOrder,
  expandedRowRef,
}: ExpandedOrderBookOrderRowProps) => {
  const {
    openOrderSwapId: orderId,

    toAsset,
    fromAsset,
    quotePrice,
    basePrice,

    toAssetAmountRemaining: maxFilltoAssetAmount,
    fromAssetAmountRemaining: maxFillfromAssetAmount,
  } = fillOrderData;

  const [fillTradingPairAmounts, setFillTradingPairAmounts] =
    useState<TradingPairAmounts>({
      from: null,
      to: null,
    });

  const maxFill =
    tradingListType === TradingListType.upper
      ? maxFilltoAssetAmount
      : maxFillfromAssetAmount;

  const amountLabelFormatted =
    tradingListType === TradingListType.upper ? toAsset?.shortName : fromAsset?.shortName;

  const fillAsset = toAsset;

  const inputValue =
    tradingListType === TradingListType.upper
      ? fillTradingPairAmounts.to
      : fillTradingPairAmounts.from;

  const fillAmount = fillTradingPairAmounts.to;

  const handleChangeInputValue = (value: string | null) => {
    if (!value) {
      setFillTradingPairAmounts({
        from: '',
        to: '',
      });
      return;
    }

    const amountInput = value;
    const newFillAmount = clearStringNumericInput(
      amountInput,
      fillAsset?.decimalPrecision ?? defaultAdaPrecision,
    );

    if (!isValidBig(newFillAmount)) {
      setFillTradingPairAmounts({
        from: '',
        to: '',
      });
      return;
    }

    if (tradingListType === TradingListType.upper) {
      const to = newFillAmount;
      const fromIndivisible = round(times(to, quotePrice), 6);
      const from = trimTrailingZeros(fromIndivisible);
      setFillTradingPairAmounts({
        from,
        to,
      });
    } else {
      const from = newFillAmount;
      const toIndivisible = round(times(from, basePrice), 6);
      const to = trimTrailingZeros(toIndivisible);
      setFillTradingPairAmounts({
        from,
        to,
      });
    }
  };

  const {
    isAmountValid,
    helperText,

    handleSetMaxFillAmount,
    handlePreviewOrder,
  } = useSwapFillOrder({
    selectedAssets: {
      from: fromAsset || null,
      to: toAsset || null,
    },
    fillAsset,
    fillAmount,

    inputValue,
    handleChangeInputValue,

    maxFill,

    priceFormatted: pricePreviewDialogFormatted,
    orderId,
    handleToggleExpandOrder,
  });

  return (
    <>
      <AmountRow isExpanded={isOrderExpanded}>
        <FirstCell colSpan={3}>
          <AmountContainer>
            <Typography variant="body3" component="h4" color="gray.light" fontSize="12px">
              Amount:
            </Typography>

            <Amount>
              <TextField
                autoComplete="off"
                value={inputValue}
                onChange={(e) => handleChangeInputValue(e.target.value)}
              />

              <Unit
                variant="poweredBy"
                fontWeight="500"
                lineHeight="15px"
                color="soldOutColorStatus.main"
              >
                {amountLabelFormatted}
              </Unit>
            </Amount>
          </AmountContainer>
        </FirstCell>
      </AmountRow>

      {helperText && (
        <ErrorTextRow isExpanded={isOrderExpanded}>
          <ActionsCell colSpan={3}>
            <ErrorText>{helperText}</ErrorText>
          </ActionsCell>
        </ErrorTextRow>
      )}

      <ActionsRow isExpanded={isOrderExpanded} ref={expandedRowRef}>
        <ActionsCell colSpan={2}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid container gap="10px">
              <ChipButton onClick={handleSetMaxFillAmount} variant="outlined">
                <ChipTitle>Max</ChipTitle> <ChipValue>{maxFill}</ChipValue>
              </ChipButton>
            </Grid>
          </Grid>
        </ActionsCell>

        <ResponsiveTableCell
          style={{ verticalAlign: 'top', height: '32px' }}
          padding="none"
          colSpan={1}
        >
          <PreviewActionButton
            disableRipple
            onClick={() => handlePreviewOrder(fillTradingPairAmounts)}
            disabled={!isAmountValid}
          >
            <Typography
              variant="poweredBy"
              fontWeight="500"
              color="soldOutColorStatus.main"
            >
              Preview
            </Typography>
          </PreviewActionButton>
        </ResponsiveTableCell>
      </ActionsRow>
    </>
  );
};

const Unit = styled(Typography)(({ theme }) => ({
  color: theme.palette.action.disabled,
}));

const TableRowStyled = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})<{ isExpanded: boolean }>(({ isExpanded, theme }) => ({
  transition: 'max-height 3s ease-out, min-height 3s ease-out, padding 3s ease',

  '& td': {
    background: isExpanded ? 'rgba(41, 50, 80, 0.50)' : 'transparent',
    paddingTop: '7px',

    '&:first-of-type': {
      borderRadius: `${theme.borderRadius.sm} 0 0 0`,
    },
    '&:last-of-type': {
      borderRadius: `0 ${theme.borderRadius.sm} 0 0`,
    },
  },
}));

const ResponsiveTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.soldOutColorStatus.main,
  fontSize: '12px',
  fontWeight: '500',
  lineHeight: '16px',
  padding: '2px 8px',
  width: 'fit-content',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    verticalAlign: 'middle',
  },
}));

const ActionsCell = styled(ResponsiveTableCell)({
  paddingRight: '0',
});

export const ActionButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.highlightedFrames.main}`,
  borderRadius: theme.borderRadius.xs,
  background: 'transparent',
  padding: '6px 15px',
  height: '32px',

  '&:hover': {
    background: '#4C54F5',
    border: '1px solid #4C54F5',
    boxShadow: 'none',

    '& > .MuiTypography-root': {
      color: theme.palette.textColor.main,
    },
  },

  '&:disabled': {
    background: 'transparent !important',
    cursor: 'not-allowed',
    border: `1px solid ${theme.palette.highlightedFrames.main} !important`,
    pointerEvents: 'all',
    boxShadow: 'none !important',
  },

  '& svg': {
    display: 'block',
  },
}));

const ChipButton = styled(ActionButton)({
  '&.MuiButtonBase-root': {
    display: 'flex',
    gap: '6px',
    padding: '4px 7px',
    fontSize: '13px',
  },
});

const ChipValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.action.disabled,
  fontSize: '12px',
}));

const ChipTitle = styled(ChipValue)({
  color: '#C4CFF5',
});

const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: '600',
  lineHeight: '16px',
  width: '200px',
  marginBottom: '4px',
  color: theme.palette.chip.error.color,
}));

const ActionsRow = styled(TableRowStyled)(({ theme }) => ({
  verticalAlign: 'center',

  '& td': {
    paddingTop: '6px',

    '&:first-of-type': {
      borderRadius: `0 0 0 ${theme.borderRadius.sm}`,
      paddingBottom: '10px',
    },
    '&:last-of-type': {
      borderRadius: `0 0 ${theme.borderRadius.sm} 0`,
    },
  },
}));

const ErrorTextRow = styled(TableRowStyled)({
  verticalAlign: 'center',

  '& td': {
    paddingTop: '0',

    '&:first-of-type': {
      borderRadius: `0`,
    },
    '&:last-of-type': {
      borderRadius: `0`,
    },
  },
});

const AmountRow = styled(TableRowStyled)({
  width: '100%',
  verticalAlign: 'top',

  '& td': {
    '&:first-of-type': {
      borderRadius: '0',
    },
    '&:last-of-type': {
      borderRadius: '0',
    },
  },
});

const AmountContainer = styled('label')(({ theme }) => ({
  backgroundColor: theme.palette.bgPrimaryGradient.contrastText,
  padding: '9px 10px',
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '12px',
  position: 'relative',
  border: '1px solid transparent',

  '&:hover': {
    border: `1px solid ${theme.palette.primary.main}`,
  },

  '&:focus-within': {
    border: `1px solid ${theme.palette.primary.main}`,
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    lineHeight: '20px',
  },
}));

const Amount = styled(Grid)(({ theme }) => ({
  display: 'flex',
  columnGap: '14px',
  alignItems: 'center',

  '.MuiInputBase-root': {
    borderRadius: '0',
    width: '100%',

    fieldset: {
      border: 'none',
    },
    input: {
      fontWeight: '500',
      fontSize: '13px',
      lineHeight: '21px',
      color: '#FFFFFF',
      backgroundColor: theme.palette.bgPrimaryGradient.contrastText,
      padding: '0',
      paddingLeft: '15px',
      height: 'auto',
      border: 'none',

      '&:focus + label': {
        borderColor: 'green',
      },
    },
  },
}));

const FirstCell = styled(ResponsiveTableCell)(() => ({
  width: '130px',
}));

const LastCell = styled(ResponsiveTableCell)(({ theme }) => ({
  paddingRight: '10px',
  width: '155px',

  [theme.breakpoints.down('sm')]: {
    width: '140px',
    minWidth: '140px',
  },

  '& button': {
    maxWidth: '140px',
    padding: '10px 12px',
    border: `1px solid ${theme.palette.highlightedFrames.main}`,
    borderRadius: theme.borderRadius.xs,
    background: 'transparent',
    height: '32px',

    span: {
      color: 'rgb(193, 206, 241)',
    },

    '&:hover': {
      background: '#4C54F5',
      border: '1px solid #4C54F5',
      boxShadow: 'none',

      '& > .MuiTypography-root': {
        color: theme.palette.textColor.main,
      },
    },

    '& span': {
      fontSize: '13px',
      lineHeight: '16px',
    },
  },
}));

const PreviewActionButton = styled(ActionButton)(({ theme }) => ({
  height: '32px',
  width: 'calc(100% - 8px)',
  marginLeft: '8px',

  padding: '0',

  '&:disabled': {
    background: 'transparent',
    opacity: '0.5',

    '& > .MuiTypography-root': {
      color: theme.palette.soldOutColorStatus.main,
    },
  },
}));

export default OrderBookOrdersTableRow;
