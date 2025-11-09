import { Grid } from '@mui/material';
import { FC } from 'react';
import MarketChartSkeleton from '~/pages/Swap/components/MarketChartSkeleton';
import { Asset } from '~/redux/api';
import { filterWhitespaces, MIN_DATA_SIZE_TO_DISPLAY_CHART } from '~/utils/charts';

import { ChartOptions } from '..';
import NoChartResults from '../NoChartResults';
import { TimeInterval } from '../utils';
import { LineChart, TimeSeriesLineChartDataPoint } from './Chart';

type ChartOptionsContainerProps = {
  selectedChartOptions: ChartOptions;
  isLoadingChart: boolean;
  timeSeriesDataPoints: TimeSeriesLineChartDataPoint[];
  priceAsset: Asset | null;
};

const LineChartContainer: FC<ChartOptionsContainerProps> = ({
  selectedChartOptions,
  isLoadingChart,
  timeSeriesDataPoints,
  priceAsset,
}) => {
  const displayHoursAndMinutes =
    selectedChartOptions.timeFrame === TimeInterval.OneDay ||
    selectedChartOptions.timeFrame === TimeInterval.SevenDays;

  const filteredTimeSeriesDataPoints = filterWhitespaces(timeSeriesDataPoints);
  const isDataSufficientForChart =
    filteredTimeSeriesDataPoints.length >= MIN_DATA_SIZE_TO_DISPLAY_CHART;

  const isShowingChart = !isLoadingChart && isDataSufficientForChart && priceAsset;
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
        <LineChart
          timeSeriesDataPoints={timeSeriesDataPoints}
          priceAsset={priceAsset}
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

export default LineChartContainer;
