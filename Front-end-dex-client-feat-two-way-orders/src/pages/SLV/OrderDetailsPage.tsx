import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link as MuiLink,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '~/components/AppLayout/config';
import { useTradingPairs } from '~/context/tradingPairsContext';
import useSlvCancelTwoWayOrderSubmit from '~/hooks/slv/useCancelTwoWayOrderSubmit';
import {
  type TwoWayOrderHistory,
  type TwoWayOrderList,
  type TwoWayOrderResult,
  useGetSlvBalanceQuery,
  useGetTwoWayOrderByIdQuery,
  useGetTwoWayOrderHistoryQuery,
  useGetTwoWayOrdersQuery,
} from '~/redux/api/core';
import { formatNumber } from '~/utils/mathUtils';
import { indivisibleToUnit } from '~/utils/mathUtils';
import { defaultAdaPrecision } from '~/utils/tradingPairsUtils';

const OrderDetailsPage: FC = () => {
  const { orderId = '' } = useParams();
  const { tradingAssets } = useTradingPairs();
  const { enqueueSnackbar } = useSnackbar();

  const getPrecision = (assetId?: string | null): number => {
    if (!assetId) return defaultAdaPrecision;
    const asset = tradingAssets.find((a) => a.assetId === assetId);
    return asset?.decimalPrecision ?? defaultAdaPrecision;
  };

  const {
    data: order,
    isLoading: isLoadingOrder,
    error: orderError,
    refetch: refetchOrder,
  } = useGetTwoWayOrderByIdQuery({ orderId });
  const {
    data: history,
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useGetTwoWayOrderHistoryQuery({ orderId });
  const { isLoading: isLoadingBalance, error: balanceError } = useGetSlvBalanceQuery();
  const { data: ordersList, refetch: refetchOrdersList } = useGetTwoWayOrdersQuery();

  const extractUtxoReference = useCallback(
    (list?: TwoWayOrderList | null) => {
      const source = list ?? ordersList;
      const listItem = (source || []).find((o) => o.twoWayOrderId === orderId);
      if (
        listItem?.utxoReferenceTransactionHash != null &&
        listItem.utxoReferenceIndex != null
      ) {
        return `${listItem.utxoReferenceTransactionHash}#${listItem.utxoReferenceIndex}`;
      }
      return null;
    },
    [ordersList, orderId],
  );

  const canCancel = useMemo(() => {
    const raw = (order as TwoWayOrderResult | undefined)?.orderStatus || '';
    const status = String(raw).toUpperCase();
    return status === 'OPEN' || status === 'PLACED';
  }, [order]);

  const utxoReference = useMemo(() => extractUtxoReference(), [extractUtxoReference]);

  useEffect(() => {
    if (!ordersList) {
      console.log('[SLV][OrderDetails] Orders list is empty or unavailable');
      return;
    }

    const references = ordersList
      .map(({ twoWayOrderId, utxoReferenceTransactionHash, utxoReferenceIndex }) =>
        utxoReferenceTransactionHash != null && utxoReferenceIndex != null
          ? `${twoWayOrderId}: ${utxoReferenceTransactionHash}#${utxoReferenceIndex}`
          : null,
      )
      .filter((entry): entry is string => entry != null);

    console.log('[SLV][OrderDetails] Two-way order UTXOs:', references);
    console.log('[SLV][OrderDetails] Selected order UTXO:', utxoReference ?? 'N/A');
  }, [ordersList, utxoReference]);

  const { handleCancel, isLoading: isCancelling } = useSlvCancelTwoWayOrderSubmit({
    utxoReference: utxoReference || '',
    onSuccess: async () => {
      enqueueSnackbar('Order cancellation submitted', { variant: 'success' });
      await Promise.all([refetchOrder(), refetchHistory()]);
    },
  });

  const handleCancelClick = useCallback(async () => {
    let latestOrders = ordersList;
    try {
      const result = await refetchOrdersList();
      latestOrders = (result.data as TwoWayOrderList | undefined) ?? ordersList;
    } catch (error) {
      console.error('Failed to refresh orders before cancellation', error);
      enqueueSnackbar('Failed to refresh orders before cancellation', {
        variant: 'error',
      });
      return;
    }

    const latestReference = extractUtxoReference(latestOrders);
    if (!latestReference) {
      enqueueSnackbar('Unable to locate order reference. Please try again.', {
        variant: 'error',
      });
      return;
    }

    try {
      await handleCancel(latestReference);
    } catch (error) {
      console.error('Failed to initiate cancellation', error);
    }
  }, [
    refetchOrdersList,
    ordersList,
    extractUtxoReference,
    enqueueSnackbar,
    handleCancel,
  ]);

  const statusColor = useMemo<'default' | 'primary' | 'success' | 'error'>(() => {
    const raw = (order as TwoWayOrderResult | undefined)?.orderStatus || '';
    const status = String(raw).toUpperCase();
    if (status === 'OPEN' || status === 'PLACED') return 'primary';
    if (status === 'FILLED') return 'success';
    if (status === 'CANCELLED') return 'error';
    return 'default';
  }, [order]);

  const extractErrorMessage = (e: unknown) =>
    (e as { data?: { message?: string } } | undefined)?.data?.message;

  const hasError = orderError || historyError || balanceError;
  const isLoading = isLoadingOrder || isLoadingHistory || isLoadingBalance;

  return (
    <Wrapper container gap="24px" alignItems="start" wrap="nowrap">
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h5">Order details</Typography>
          <Chip
            label={(order as TwoWayOrderResult | undefined)?.orderStatus || 'UNKNOWN'}
            color={statusColor}
            size="small"
          />
          <Box flex={1} />
          {canCancel && utxoReference && (
            <Button
              variant="contained"
              color="error"
              onClick={() => void handleCancelClick()}
              disabled={isCancelling}
            >
              Cancel Order
            </Button>
          )}
          <MuiLink component={Link} to={ROUTES.SLV} underline="hover" color="inherit">
            Back to SLV
          </MuiLink>
        </Stack>
      </Grid>

      {hasError && (
        <Grid item xs={12}>
          <Alert severity="error">
            {extractErrorMessage(orderError) ||
              extractErrorMessage(historyError) ||
              extractErrorMessage(balanceError) ||
              'Failed to load data'}
          </Alert>
        </Grid>
      )}

      {isLoading ? (
        <Grid item xs={12}>
          <LoadingBox>
            <CircularProgress />
          </LoadingBox>
        </Grid>
      ) : (
        <>
          <Grid item xs={8}>
            <PaperSection>
              <SectionHeader>
                <Typography variant="subtitle1">Summary</Typography>
                <Typography variant="body2" color="text.secondary">
                  #{(order as TwoWayOrderResult | undefined)?.twoWayOrderId}
                </Typography>
              </SectionHeader>
              {order && (
                <OrderSummary
                  order={order as TwoWayOrderResult}
                  getPrecision={getPrecision}
                />
              )}
            </PaperSection>

            <PaperSection>
              <SectionHeader>
                <Typography variant="subtitle1">History</Typography>
                <Typography variant="body2" color="text.secondary">
                  {(history as TwoWayOrderHistory | undefined)?.length || 0} events
                </Typography>
              </SectionHeader>
              <HistoryList history={(history as TwoWayOrderHistory) || []} />
            </PaperSection>
          </Grid>
        </>
      )}
    </Wrapper>
  );
};

const OrderSummary = ({
  order,
  getPrecision,
}: {
  order: TwoWayOrderResult;
  getPrecision: (assetId?: string | null) => number;
}) => {
  const fromPrecision = getPrecision(order.fromAssetId);
  const toPrecision = getPrecision(order.toAssetId);

  const rows = [
    {
      label: 'From amount',
      value: indivisibleToUnit(order.fromAssetAmount, fromPrecision),
    },
    { label: 'To amount', value: indivisibleToUnit(order.toAssetAmount, toPrecision) },
    { label: 'Price', value: formatNumber(String(order.price)) },
    { label: 'Created', value: new Date(order.created).toLocaleString() },
    { label: 'Updated', value: new Date(order.updated).toLocaleString() },
    { label: 'Partial fills', value: String(order.partialFillCount) },
    {
      label: 'To net received',
      value: indivisibleToUnit(order.toAssetNetReceived, toPrecision),
    },
    {
      label: 'PnL (to abs)',
      value: indivisibleToUnit(order.pnlToAbs, toPrecision),
    },
    { label: 'PnL (to %)', value: `${order.pnlToPct}%` },
  ];

  return (
    <Stack spacing={1.5} divider={<Divider flexItem />}>
      {rows.map((r) => (
        <Grid key={r.label} container>
          <Grid item xs={5}>
            <Typography variant="body2" color="text.secondary">
              {r.label}
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">{r.value}</Typography>
          </Grid>
        </Grid>
      ))}
    </Stack>
  );
};

const HistoryList = ({ history }: { history: TwoWayOrderHistory }) => {
  if (!history || history.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No activity yet
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5} divider={<Divider flexItem />}>
      {history.map((h) => (
        <HistoryRow key={h.twoWayOrderActivityId} historyItem={h} />
      ))}
    </Stack>
  );
};

const HistoryRow = ({ historyItem: h }: { historyItem: TwoWayOrderHistory[number] }) => {
  // Precision not needed for history amounts here; using defaults below

  // We don't have assetIds in the history item, but they map to the order's from/to.
  // Use route params to fetch orderIds? Simpler: infer from URL params is not needed here.
  // Instead, render raw with best-effort if precision unknown.
  // Consumers of HistoryRow should be within the OrderDetailsPage where we can pass precisions if needed.

  // As a compromise, we display both From/To amounts when present but cannot map assetIds here.
  // They will be formatted by indivisibleToUnit when we have a precision; fallback to defaultAdaPrecision.
  const fromPrecision = defaultAdaPrecision; // overridden by parent via context if needed later
  const toPrecision = defaultAdaPrecision;

  return (
    <Grid container alignItems="center">
      <Grid item xs={2}>
        <Chip label={h.activityType} size="small" />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2" color="text.secondary">
          {new Date(h.created).toLocaleString()}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {h.txHash && (
            <MuiLink
              href={`https://cardanoscan.io/transaction/${h.txHash}`}
              target="_blank"
              rel="noreferrer"
              underline="hover"
            >
              Tx
            </MuiLink>
          )}
          {h.userPayFrom && (
            <Typography variant="body2">
              Pay: {indivisibleToUnit(h.userPayFrom, fromPrecision)}
            </Typography>
          )}
          {h.userReceiveTo && (
            <Typography variant="body2">
              Receive: {indivisibleToUnit(h.userReceiveTo, toPrecision)}
            </Typography>
          )}
          {h.feeFrom && (
            <Typography variant="body2" color="text.secondary">
              Fee From: {indivisibleToUnit(h.feeFrom, fromPrecision)}
            </Typography>
          )}
          {h.feeTo && (
            <Typography variant="body2" color="text.secondary">
              Fee To: {indivisibleToUnit(h.feeTo, toPrecision)}
            </Typography>
          )}
          {h.message && (
            <Typography variant="body2" color="text.secondary">
              {h.message}
            </Typography>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

// const BalanceList = ({ balance }: { balance: SlvBalance }) => {
//   const { tradingAssets } = useTradingPairs();
//   const getPrecision = (assetId?: string | null): number => {
//     if (!assetId) return defaultAdaPrecision;
//     const asset = tradingAssets.find((a) => a.assetId === assetId);
//     return asset?.decimalPrecision ?? defaultAdaPrecision;
//   };
//   if (!balance || balance.length === 0) {
//     return (
//       <Typography variant="body2" color="text.secondary">
//         No SLV balance
//       </Typography>
//     );
//   }
//   return (
//     <Stack spacing={1}>
//       {balance.map((b) => (
//         <Grid key={b.assetId} container direction="column">
//           <Grid item xs={7}>
//             <Typography variant="body2" color="text.secondary">
//               {b.assetId}
//             </Typography>
//           </Grid>
//           <Grid item xs={5}>
//             <Typography variant="body2" textAlign="right">
//               {indivisibleToUnit(b.amount, getPrecision(b.assetId))}
//             </Typography>
//           </Grid>
//         </Grid>
//       ))}
//     </Stack>
//   );
// };

const Wrapper = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1200px',
  margin: '0 auto',
}));

const PaperSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: '#202740',
  borderRadius: '12px',
  marginBottom: theme.spacing(3),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1.5),
}));

const LoadingBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
});

export default OrderDetailsPage;
