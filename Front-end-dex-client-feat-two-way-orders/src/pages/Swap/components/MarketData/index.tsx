import { Grid } from '@mui/material';
import { compact, flatMap, map } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTradingPairs } from '~/context/tradingPairsContext';
import {
  useGetOrderSwapAggregatedPricesQuery,
  useGetOrderSwapKlineAggregatedPricesQuery,
} from '~/redux/api';
import { LOCAL_STORAGE_KEYS } from '~/utils/constants';
import { calculateStartEndTime } from '~/utils/dateUtils';

import { isValidBinInterval } from './BinSizeSelector';
import CandleStickChartContainer from './CandlestickChart';
import ChartOptionsHeader from './ChartOptionsHeader';
import MarketDataHeader from './Header';
import HeaderSkeleton from './HeaderSkeleton';
import LineChartContainer from './LineChart';
import { TimeSeriesLineChartDataPoint } from './LineChart/Chart';
import {
  BinInterval,
  calculateChartsBinInterval,
  ChartType,
  swapChartTypes,
  timeframes,
  TimeInterval,
} from './utils';

type MarketDataProps = {
  isLoadingMarketData: boolean;
  marketPrice: string | undefined;
};

export type ChartOptions = {
  timeFrame: TimeInterval;
  chartType: ChartType;
};

const isMarketChartTypeValid = (chartType: string | null): chartType is ChartType =>
  Object.values(ChartType).includes(chartType as ChartType);

const MarketData: FC<MarketDataProps> = ({
  marketPrice,
  isLoadingMarketData,
}) => {
  const { marketDataAssets, handleSetMarketDataPairAssets } =
    useTradingPairs();

  const [selectedChartOptions, setSelectedChartOptions] = useState<ChartOptions>({
    timeFrame: TimeInterval.OneMonth,
    chartType: ChartType.candlestick,
  });

  const { startTime, endTime } = useMemo(
    () => calculateStartEndTime(selectedChartOptions.timeFrame),
    [selectedChartOptions.timeFrame],
  );

  const chartAssetPairString = (marketDataAssets.from && marketDataAssets.to) ? `${marketDataAssets?.from?.assetId}-${marketDataAssets?.to?.assetId}` : null;

  const initialChartsBinInterval = () => calculateChartsBinInterval(startTime, endTime);

  const [selectedBinInterval, setSelectedBinInterval] = useState<BinInterval>(
    initialChartsBinInterval,
  );

  const isSelectedBinIntervalValid = isValidBinInterval(
    new Date(startTime),
    new Date(endTime),
    selectedBinInterval,
  );

  useEffect(() => {
    setSelectedBinInterval(calculateChartsBinInterval(startTime, endTime));
  }, [selectedChartOptions.timeFrame]);

  const handleChangeSelectedBinInterval = (binInterval: BinInterval) =>
    setSelectedBinInterval(binInterval);

  const klineChartDataResponse = useGetOrderSwapKlineAggregatedPricesQuery(
    {
      assetPair: chartAssetPairString || '',
      startTime,
      endTime,
      binInterval: selectedBinInterval,
    },
    {
      skip:
        !chartAssetPairString ||
        selectedChartOptions.chartType !== ChartType.candlestick ||
        !isSelectedBinIntervalValid,
    },
  );

  const lineChartDataResponse = useGetOrderSwapAggregatedPricesQuery(
    {
      assetPair: chartAssetPairString || '',
      startTime,
      endTime,
      binInterval: selectedBinInterval,
    },
    {
      skip:
        !chartAssetPairString ||
        selectedChartOptions.chartType !== ChartType.line ||
        !isSelectedBinIntervalValid,
    },
  );

  const lineChartTimeSeriesDataPoints: TimeSeriesLineChartDataPoint[] = compact(
    flatMap(lineChartDataResponse.data, (data) =>
      map(data, ({ timestamp, price }) =>
        timestamp ? { value: price, time: timestamp } : null,
      ),
    ),
  );

  const handleChangeSelectedOptions = (options: ChartOptions) => {
    setSelectedChartOptions(options);

    const marketDataChartType = options.chartType;
    if (marketDataChartType) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.SELECTED_MARKET_DATA_CHART_TYPE,
        marketDataChartType,
      );
    }
  };

  useEffect(() => {
    const marketDataChartType = localStorage.getItem(
      LOCAL_STORAGE_KEYS.SELECTED_MARKET_DATA_CHART_TYPE,
    );

    if (isMarketChartTypeValid(marketDataChartType) && marketDataChartType) {
      handleChangeSelectedOptions({
        ...selectedChartOptions,
        chartType: marketDataChartType,
      });
    }
  }, []);

  if (isLoadingMarketData) {
    return <HeaderSkeleton />;
  }

  return (
    <Grid flexDirection="column" display="flex" gap="20px">
      <MarketDataHeader
        marketDataAssets={marketDataAssets}
        marketPrice={marketPrice}
        handleSetMarketDataPairAssets={handleSetMarketDataPairAssets}
      />

      <ChartOptionsHeader
        chartTypeFields={swapChartTypes}
        timeframeFields={timeframes}
        selectedChartOptions={selectedChartOptions}
        setSelectedChartOptions={handleChangeSelectedOptions}
        selectedBinInterval={selectedBinInterval}
        setSelectedBinInterval={handleChangeSelectedBinInterval}
        startTime={new Date(startTime)}
        endTime={new Date(endTime)}
      />

      {selectedChartOptions.chartType === ChartType.line && (
        <LineChartContainer
          selectedChartOptions={selectedChartOptions}
          isLoadingChart={lineChartDataResponse.isFetching}
          timeSeriesDataPoints={lineChartTimeSeriesDataPoints}
          priceAsset={lineChartDataResponse.data?.assetPair.quoteAsset || null}
        />
      )}

      {selectedChartOptions.chartType === ChartType.candlestick && (
        <CandleStickChartContainer
          selectedChartOptions={selectedChartOptions}
          isLoadingChart={klineChartDataResponse.isFetching}
          timeSeriesDataPoints={klineChartDataResponse?.data?.data || []}
        />
      )}
    </Grid>
  );
};

export default MarketData;
