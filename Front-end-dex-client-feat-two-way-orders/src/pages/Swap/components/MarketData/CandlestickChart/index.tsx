import { Grid } from '@mui/material';
import { UTCTimestamp } from 'lightweight-charts';
import { isString, map } from 'lodash';
import { FC } from 'react';
import MarketChartSkeleton from '~/pages/Swap/components/MarketChartSkeleton';
import { MIN_DATA_SIZE_TO_DISPLAY_CHART } from '~/utils/charts';

import { ChartOptions } from '..';
import NoChartResults from '../NoChartResults';
import { TimeInterval } from '../utils';
import CandlestickChart, { TimeSeriesDataPoint } from './Chart';

const formatDate = (ohlc: TimeSeriesDataPoint[]): TimeSeriesDataPoint[] =>
  map(ohlc, (item) => {
    const { time, ...rest } = item;
    return isString(time)
      ? { time: (Date.parse(time) / 1000) as UTCTimestamp, ...rest }
      : { time, ...rest };
  });

type ChartOptionsContainerProps = {
  selectedChartOptions: ChartOptions;
  isLoadingChart: boolean;
  timeSeriesDataPoints: TimeSeriesDataPoint[];
};
const CandleStickChart: FC<ChartOptionsContainerProps> = ({
  selectedChartOptions,
  isLoadingChart,
  timeSeriesDataPoints,
}) => {
  const displayHoursAndMinutes =
    selectedChartOptions.timeFrame === TimeInterval.OneDay ||
    selectedChartOptions.timeFrame === TimeInterval.SevenDays;

  const isDataSufficientForChart =
    timeSeriesDataPoints.length >= MIN_DATA_SIZE_TO_DISPLAY_CHART;

  const isShowingChart = !isLoadingChart && isDataSufficientForChart;
  const isShowingEmptyCase = !isDataSufficientForChart && !isLoadingChart;
  const isShowingLoader = isLoadingChart;

  return (
    <Grid
      display="flex"
      width="100%"
      justifyContent="center"
      flexDirection="column"
      alignContent="center"
      gap="10px"
    >
      {isShowingLoader && <MarketChartSkeleton />}

      {isShowingChart && (
        <CandlestickChart
          timeSeriesDataPoints={formatDate(timeSeriesDataPoints)}
          displayHoursAndMinutes={displayHoursAndMinutes}
        />
      )}

      {isShowingEmptyCase && (
        <NoChartResults
          title={'Not enough orders'}
          description={
            'More orders need to be traded in this token pair in order to display a meaningful chart'
          }
        />
      )}
    </Grid>
  );
};

export default CandleStickChart;
