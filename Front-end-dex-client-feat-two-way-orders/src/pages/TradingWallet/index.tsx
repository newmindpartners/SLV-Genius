import { ChevronLeft } from '@mui/icons-material';
import { Stack, styled, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '~/components/Alert';
import Button from '~/components/Button/Button';
import CancelOrderDialogProvider from '~/context/cancelOrderDialog';
import TradingPairsContextProvider from '~/context/tradingPairsContext';
import {
  useGetOrderSwapMarketMakerBinnedOrdersQuery,
  useGetTradingWalletQuery,
  useListSwapOrdersQuery,
} from '~/redux/api';
import { calculateStartEndTime } from '~/utils/dateUtils';
import { IntervalType } from '~/utils/interval';

import { PillSelect } from '../Leaderboard/components/PillSelect';
import { TablePagination } from '../Leaderboard/components/TablePagination';
import { calculateChartsBinInterval } from '../Swap/components/MarketData/utils';
import { OrderTable } from './components/OrderTable';
import { TradingWalletDetails } from './components/TradingWalletDetails';
import { TradingWalletStats } from './components/TradingWalletStats';
import { orderFilterOptions } from './constants';
import { getChartDataByMode } from './helpers/getChartItemsByMode';
import { ChartMode } from './types/ChartMode';
import { OrderFilter } from './types/OrderFilter';

export const TradingWallet = () => {
  const params = useParams();
  const navigate = useNavigate();

  const id = params.botId as string;

  const [cursor, setCursor] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState(OrderFilter.All);

  const [chartMode, setChartMode] = useState(ChartMode.Earned);
  const [intervalType, setIntervalType] = useState(IntervalType.ThreeMonth);

  const {
    data: tradingWallet,
    isFetching: isFetchingTradingWallet,
    error: errorTradingWallet,
  } = useGetTradingWalletQuery({
    tradingWalletId: id,
  });

  const { data: ordersData, isFetching: isFetchingOrders } = useListSwapOrdersQuery(
    {
      ...(tradingWallet?.tradingWalletStakeKeyHash
        ? { filterByWalletStakeKeyHash: tradingWallet?.tradingWalletStakeKeyHash }
        : {}),
      ...(tradingWallet?.assetOne && tradingWallet?.assetTwo
        ? {
            filterByAssetId: [
              tradingWallet.assetOne.assetId,
              tradingWallet.assetTwo.assetId,
            ],
          }
        : {}),
      ...(orderFilter === OrderFilter.Open && { filterByOrderSwapStatus: 'OPEN' }),
      ...(orderFilter === OrderFilter.History && { filterByOrderSwapStatus: 'FILLED' }),
      cursor: cursor || undefined,
    },
    {
      skip: !tradingWallet?.tradingWalletStakeKeyHash,
    },
  );

  const { startTime, endTime } = useMemo(
    () => calculateStartEndTime(intervalType),
    [intervalType],
  );

  const { data: marketMakerMetrics, isFetching: isFetchingMakerMetrics } =
    useGetOrderSwapMarketMakerBinnedOrdersQuery(
      {
        assetPair: `${tradingWallet?.assetOne.assetId}-${tradingWallet?.assetTwo.assetId}`,
        binInterval: calculateChartsBinInterval(startTime, endTime),
        endTime,
        startTime,
        filterByWalletStakeKeyHash: tradingWallet?.tradingWalletStakeKeyHash,
      },
      {
        skip:
          !tradingWallet?.tradingWalletStakeKeyHash ||
          !tradingWallet?.assetOne ||
          !tradingWallet?.assetTwo,
      },
    );

  const assetOne = marketMakerMetrics?.assetPair.assetOne;
  const assetTwo = marketMakerMetrics?.assetPair.assetTwo;
  const priceAssetId = marketMakerMetrics?.priceAssetId;
  const priceAsset =
    assetOne?.assetId === priceAssetId
      ? assetOne
      : assetTwo?.assetId === priceAssetId && assetTwo;

  const chartData = useMemo(() => {
    return getChartDataByMode(chartMode, priceAsset || null, marketMakerMetrics);
  }, [chartMode, priceAsset, marketMakerMetrics]);

  const orders = ordersData?.results || [];

  const handleBack = useCallback(() => {
    navigate('/leaderboard');
    window.scrollTo(0, 0);
  }, []);

  return (
    <TradingPairsContextProvider>
      <CancelOrderDialogProvider>
        <TradingWallet.Wrapper>
          <Stack direction="row">
            <Button
              size="small"
              color="transparent"
              startIcon={<ChevronLeft />}
              onClick={handleBack}
            >
              Back
            </Button>
          </Stack>

          {!errorTradingWallet ? (
            <Stack spacing={2}>
              <TradingWalletDetails
                data={tradingWallet}
                isLoading={isFetchingTradingWallet}
              />
            </Stack>
          ) : (
            <Alert severity="error">
              We apologize, but there was an error retrieving the bot details, our team is
              working to resolve this issue soon.
            </Alert>
          )}

          <TradingWalletStats
            chartData={chartData}
            chartMode={chartMode}
            assetPair={{
              assetOne,
              assetTwo,
            }}
            intervalType={intervalType}
            isLoading={isFetchingMakerMetrics || isFetchingTradingWallet}
            onChartModeChange={setChartMode}
            onIntervalTypeChange={setIntervalType}
          />

          <Stack spacing={2}>
            <TradingWallet.OrderControls>
              <Typography variant="h6">Orders</Typography>

              <PillSelect
                value={orderFilter}
                options={orderFilterOptions}
                onChange={setOrderFilter}
              />
            </TradingWallet.OrderControls>

            <OrderTable
              orders={orders}
              isLoading={isFetchingOrders}
              isInitialLoading={!orders}
            />

            <TablePagination
              isPrevPageDisabled={!ordersData?.previous}
              isNextPageDisabled={!ordersData?.next}
              isPrevPageLoading={cursor === ordersData?.previous && isFetchingOrders}
              isNextPageLoading={cursor === ordersData?.next && isFetchingOrders}
              onPrevPage={() => setCursor(ordersData?.previous ?? null)}
              onNextPage={() => setCursor(ordersData?.next ?? null)}
            />
          </Stack>
        </TradingWallet.Wrapper>
      </CancelOrderDialogProvider>
    </TradingPairsContextProvider>
  );
};

TradingWallet.OrderControls = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    justify-content: space-between;
  }
`;

TradingWallet.Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;
