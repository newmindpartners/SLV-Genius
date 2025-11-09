import { Button, Grid, styled } from '@mui/material';
import { parseISO } from 'date-fns';
import { filter, isEmpty, map, reduce, toLower, upperFirst } from 'lodash';
import { useSnackbar } from 'notistack';
import IconButton from '~/components/Button/IconButton';
import { Close } from '~/components/Icons/Close';
import MemoizedStatusChip from '~/components/StatusChip';
import { Cell, Row, RowWithSubrows } from '~/components/Table';
import ExpandableOrdersButton from '~/components/Table/ExpandableOrdersButton';
import { useCancelOrderDialog } from '~/context/cancelOrderDialog';
import { useTradingPairs } from '~/context/tradingPairsContext';
import CurrencyLabel, { Label } from '~/pages/Swap/components/CurrencyLabel';
import { SaleOrderStatus, SwapOrder, SwapOrderTransaction } from '~/redux/api';
import { formatDateWithTime } from '~/utils/dateUtils';
import {
  div,
  indivisibleToUnit,
  plus,
  round,
  times,
  trimTrailingZeros,
} from '~/utils/mathUtils';
import { getOrderStatusLabel, isAssetADA } from '~/utils/swapOrderUtils';
import {
  defaultAdaPrecision,
  findTradingPair,
  getTradingPairPrice,
} from '~/utils/tradingPairsUtils';

type useSwapOrderFormattingProps = {
  orders: SwapOrder[];
  ordersTableExpandedRowId?: number | string | null;
  isMyOrders?: boolean;
  hideFeeColumn?: boolean;
};

/**
 * The "FILL" `transaction` represents the opposite side of our created "LIMIT" swap order.
 * Because of this, the "quote asset amount filled" is in our "base asset", and vice versa.
 */
const getFilledQuoteDetails = (row: SwapOrder) => {
  const quoteAmounts = map(row.transactions, (transaction) =>
    transaction.fromAssetAmountFilled != null
      ? indivisibleToUnit(transaction.fromAssetAmountFilled, row.toAsset.decimalPrecision)
      : '0',
  );

  const sumOfQuotes = reduce(quoteAmounts, (acc, val) => plus(acc, val), '0');

  const percentageFilled = times(
    div(sumOfQuotes, indivisibleToUnit(row.toAssetAmount, row.toAsset.decimalPrecision)),
    '100',
  );

  return { sumOfQuotes, percentageFilled };
};

type EnrichedTransactions = SwapOrderTransaction & {
  toAssetDecimalPrecision: number;
  fromAssetDecimalPrecision: number;
};

const enrichTransactions =
  (swapOrder: SwapOrder) =>
  (transaction: SwapOrderTransaction): EnrichedTransactions => {
    /**
     * In the perspective of the payload returned from the API server, the
     * transactions are essentially orders that are inverse to the order
     * that is being filled.
     * However, the UI is for the user that created the producing order
     * that is being filled, and thus we reverse the base and quote
     * amounts to make the UI more intuitive for the user.
     */
    const consumingOrderFromAssetAmountFilled = transaction.fromAssetAmountFilled;
    const consumingOrderToAssetAmountFilled = transaction.toAssetAmountFilled;

    const producingOrderToAssetAmountFilled = consumingOrderFromAssetAmountFilled;
    const producingOrderToAssetDecimalPrecision = swapOrder.toAsset.decimalPrecision;
    const producingOrderFromAssetAmountFilled = consumingOrderToAssetAmountFilled;
    const producingOrderFromAssetDecimalPrecision = swapOrder.fromAsset.decimalPrecision;

    return {
      ...transaction,
      toAssetAmountFilled: producingOrderToAssetAmountFilled,
      toAssetDecimalPrecision: producingOrderToAssetDecimalPrecision,
      fromAssetAmountFilled: producingOrderFromAssetAmountFilled,
      fromAssetDecimalPrecision: producingOrderFromAssetDecimalPrecision,
    };
  };

const isProducingOrder = (swapOrder: SwapOrder) => swapOrder.orderType === 'LIMIT';

const useSwapOrdersFormatting = ({
  orders,
  ordersTableExpandedRowId,
  isMyOrders = false,
  hideFeeColumn = false,
}: useSwapOrderFormattingProps) => {
  const { tradingPairs } = useTradingPairs();
  const { onDialogOpen: onCancelDialogOpen } = useCancelOrderDialog();
  const { enqueueSnackbar } = useSnackbar();

  const handleCancelOrder = (order: SwapOrder) => {
    onCancelDialogOpen({
      order,
    });
  };

  const modifiedOrders: RowWithSubrows[] = map(orders, (row) => {
    const { toAsset, fromAsset } = row;
    const fillTransactions = filter(
      row.transactions,
      ({ transactionType }) => transactionType === 'FILL',
    );
    const enrichedTransactions: EnrichedTransactions[] = map(
      fillTransactions,
      enrichTransactions(row),
    );
    const enrichedConsumingTransactions = isProducingOrder(row)
      ? enrichedTransactions
      : [];

    const { sumOfQuotes, percentageFilled } = getFilledQuoteDetails(row);

    if (typeof toAsset.decimalPrecision !== 'number') {
      enqueueSnackbar(
        `Failed to fetch 'toAsset' decimal precision for order ${row.orderId}`,
        {
          variant: 'error',
        },
      );
      return {
        id: row.orderId,
        cells: [],
        subrows: [],
      };
    }

    if (typeof fromAsset.decimalPrecision !== 'number') {
      enqueueSnackbar(
        `Failed to fetch 'fromAsset' decimal precision for order ${row.orderId}`,
        {
          variant: 'error',
        },
      );
      return {
        id: row.orderId,
        cells: [],
        subrows: [],
      };
    }

    const toAssetUnitAmount = indivisibleToUnit(
      row.toAssetAmount,
      toAsset.decimalPrecision,
    );
    const base = {
      content: toAssetUnitAmount,
      icon: toAsset.iconUrl,
      value: toAsset.shortName,
    };

    const fromAssetUnitAmount = indivisibleToUnit(
      row.fromAssetAmount,
      fromAsset.decimalPrecision,
    );
    const quote = {
      content: fromAssetUnitAmount,
      icon: fromAsset.iconUrl,
      value: fromAsset.shortName,
    };

    const selectedTradingPair = findTradingPair(fromAsset, toAsset, tradingPairs);

    const quotePrice = getTradingPairPrice(
      fromAsset,
      toAsset,

      fromAssetUnitAmount,
      toAssetUnitAmount,

      selectedTradingPair,
    );

    const quoteAsset = selectedTradingPair?.quoteAsset;

    const price = {
      content: trimTrailingZeros(round(quotePrice || '0', 8)),
      value: quoteAsset?.shortName,
    };

    const feeIndivisible = plus(row.transactionTotalFeesAmount || 0);

    const fee = {
      content: indivisibleToUnit(feeIndivisible, defaultAdaPrecision) + ' ADA',
    };

    const date = {
      content: formatDateWithTime(parseISO(row.created)),
    };

    const status = {
      content: getOrderStatusLabel(row),
    };

    const transaction = {
      value: row?.transactions?.[0]?.transactionUrl,
    };

    const isCancelAvailable =
      (row.status === 'OPEN' || row.status === 'SCHEDULED' || row.status === 'EXPIRED') &&
      isMyOrders;

    const formattedMakerfromAssetFee = row.makerFromAssetFeeAmount
      ? `${indivisibleToUnit(row.makerFromAssetFeeAmount, fromAsset.decimalPrecision)} ${
          fromAsset.shortName
        }`
      : '';

    const additionalMakerFeeContent =
      !isAssetADA(fromAsset.shortName) && row.makerFromAssetFeeAmount
        ? formattedMakerfromAssetFee
        : '';

    const formattedTakerfromAssetFee = row.takerFromAssetFeeAmount
      ? `${indivisibleToUnit(row.takerFromAssetFeeAmount, fromAsset.decimalPrecision)} ${
          fromAsset.shortName
        }`
      : '';

    const additionalTakerFeeContent =
      !isAssetADA(fromAsset.shortName) && row.takerFromAssetFeeAmount
        ? formattedTakerfromAssetFee
        : '';

    const orderFeeCell: Cell = {
      content: fee.content,
      align: 'left',
      decorator: (content: string) => (
        <Grid container display="flex" flexDirection="row" alignItems="center">
          <CurrencyLabel content={content.split(' ')[0]} value={content.split(' ')[1]} />
          {!isEmpty(additionalMakerFeeContent) && (
            <CurrencyLabel
              content={additionalMakerFeeContent.split(' ')[0]}
              value={additionalMakerFeeContent.split(' ')[1]}
            />
          )}
          {!isEmpty(additionalTakerFeeContent) && (
            <CurrencyLabel
              content={additionalTakerFeeContent.split(' ')[0]}
              value={additionalTakerFeeContent.split(' ')[1]}
            />
          )}
        </Grid>
      ),
    };

    const orderCells: Cell[] = [
      {
        content: quote.content,
        align: 'left',
        decorator: (content: string) => (
          <CurrencyLabel icon={quote.icon} content={content} value={quote.value} />
        ),
      },
      {
        content: base.content,
        align: 'left',
        decorator: (content: string) => (
          <CurrencyLabel icon={base.icon} content={content} value={base.value} />
        ),
      },
      {
        content: price.content,
        align: 'left',
        decorator: (content: string) => (
          <CurrencyLabel content={content} value={price.value} />
        ),
      },
      ...(hideFeeColumn ? [] : [orderFeeCell]),
      {
        content: date.content,
        align: 'left',
        decorator: (content: string) => <Label label={content} />,
      },
      {
        align: 'left',
        content: status.content,
        decorator: (content: string | SaleOrderStatus) => (
          <MemoizedStatusChip
            content={content}
            order={row}
            partialFillUnitAmount={Number(sumOfQuotes)}
            partialFillPercentage={Number(percentageFilled)}
            currency={row.toAsset.shortName}
          />
        ),
      },
      {
        content: '',
        align: 'right',
        decorator: () => (
          <Grid display="flex" gap="5px" justifyContent="flex-end">
            {transaction.value && (
              <TransactionButton>
                <a
                  style={{ color: 'white' }}
                  rel="noreferrer"
                  target="_blank"
                  href={transaction.value}
                  onClick={(event) => event.stopPropagation()}
                >
                  Transaction
                </a>
              </TransactionButton>
            )}

            {isCancelAvailable && (
              <DeleteButton
                size={'medium'}
                color={'primary'}
                onClick={() => handleCancelOrder(row)}
              >
                <Close />
              </DeleteButton>
            )}

            {enrichedConsumingTransactions.length > 0 && (
              <ExpandableOrdersButton
                transactionsCount={enrichedConsumingTransactions.length}
                rowId={row.orderId}
                ordersTableExpandedRowId={ordersTableExpandedRowId || null}
              />
            )}
          </Grid>
        ),
      },
    ];

    const subrows: Row[] = map(
      enrichedConsumingTransactions,
      (transaction: EnrichedTransactions): Row => {
        const fromAssetAmountFilledUnit = transaction.fromAssetAmountFilled
          ? indivisibleToUnit(
              transaction.fromAssetAmountFilled,
              transaction.fromAssetDecimalPrecision,
            )
          : '0';
        const toAssetAmountFilledUnit = transaction.toAssetAmountFilled
          ? indivisibleToUnit(
              transaction.toAssetAmountFilled,
              transaction.toAssetDecimalPrecision,
            )
          : '0';

        const filledAmountPriceQuotePrice = getTradingPairPrice(
          fromAsset,
          toAsset,

          fromAssetAmountFilledUnit,
          toAssetAmountFilledUnit,

          selectedTradingPair,
        );

        const filledAmountPrice = filledAmountPriceQuotePrice
          ? trimTrailingZeros(round(filledAmountPriceQuotePrice, 6))
          : null;

        const transactionFeeCell: Cell = {
          content: '-',
          align: 'left',
          decorator: (content: string) => <CurrencyLabel content={content} />,
        };

        const priceCell: Cell = {
          content: filledAmountPrice || '-',
          align: 'left',
          decorator: (content: string) => (
            <CurrencyLabel content={content} value={quoteAsset?.shortName} />
          ),
        };

        return {
          id: transaction.transactionId,
          cells: [
            {
              content: fromAssetAmountFilledUnit,
              align: 'left',
              decorator: (content: string) => (
                // the matching transaction of an order has inverted base and quote
                <CurrencyLabel icon={quote.icon} content={content} value={quote.value} />
              ),
            },
            {
              content: toAssetAmountFilledUnit,
              align: 'left',
              decorator: (content: string) => (
                <CurrencyLabel icon={base.icon} content={content} value={base.value} />
              ),
            },
            priceCell,
            ...(hideFeeColumn ? [] : [transactionFeeCell]),
            {
              content: transaction.transactionDate
                ? formatDateWithTime(parseISO(transaction.transactionDate))
                : '',
              align: 'left',
            },
            {
              content: upperFirst(toLower(transaction.transactionType)),
              align: 'left',
              decorator: (content: string | SaleOrderStatus) => (
                <MemoizedStatusChip
                  content={content}
                  order={row}
                  isTransactionCell={true}
                />
              ),
            },
            {
              content: '',
              align: 'right',
              decorator: () => (
                <Grid>
                  {transaction.transactionUrl && (
                    <TransactionButton>
                      <a
                        style={{ color: 'white' }}
                        rel="noreferrer"
                        target="_blank"
                        href={transaction.transactionUrl}
                        onClick={(event) => event.stopPropagation()}
                      >
                        Transaction
                      </a>
                    </TransactionButton>
                  )}
                </Grid>
              ),
            },
          ],
        };
      },
    );

    return {
      id: row.orderId,
      cells: orderCells,
      subrows: subrows,
    };
  });

  return modifiedOrders;
};

const TransactionButton = styled(Button)(({ theme }) => ({
  padding: '0',
  borderRadius: theme.borderRadius.xs,
  border: '1px solid #6574A7',
  textTransform: 'capitalize',
  lineHeight: '16px',
  opacity: 0,
  transition: 'opacity 0.3s',

  '& a': {
    display: 'block',
    padding: '9px 14px',
  },

  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
  },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  height: '36px',
  width: '36px',
  background: 'transparent',
  border: '1px solid #6574A7',
  opacity: 0,
  transition: '0.3s',

  path: {
    stroke: theme.palette.textColor.light,
  },

  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    boxShadow: 'none',
  },

  '&:hover:disabled': {
    background: 'transparent',
    boxShadow: 'none',
  },
}));

export default useSwapOrdersFormatting;
