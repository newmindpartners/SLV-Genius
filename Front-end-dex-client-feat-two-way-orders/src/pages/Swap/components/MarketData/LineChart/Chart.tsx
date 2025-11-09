import { Grid, useTheme } from '@mui/material';
import { createChart, IChartApi, SeriesDataItemTypeMap, Time } from 'lightweight-charts';
import { isEqual, throttle } from 'lodash';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import { ChartTooltip, DataPointTooltip } from '~/components/ChartTooltip';
import useResizeObserver from '~/hooks/misc/useResizeObserver';
import { roundNumber, trimTrailingZeros } from '~/utils/mathUtils';

import {
  ChartOptionsParams,
  COLORS,
  convertAndFormatTime,
  createCrosshairMoveHandler,
  getChartOptions,
} from '../chartUtils';
import { ChartType } from '../utils';
import { Asset } from '~/redux/api';

export type TimeSeriesLineChartDataPoint = SeriesDataItemTypeMap['Line'];

type LineChartProps = {
  timeSeriesDataPoints: TimeSeriesLineChartDataPoint[];
  priceAsset: Asset;
  displayHoursAndMinutes: boolean;
};

type ChartContainerElement = HTMLDivElement & {
  chart?: IChartApi;
};

const RESIZE_THROTTLE_MS = 10;

export const LineChart: FC<LineChartProps> = ({
  timeSeriesDataPoints,
  priceAsset,
  displayHoursAndMinutes,
}) => {
  const [toggleResize, setToggleResize] = useState(false);
  const chartRef = useRef<ChartContainerElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    palette: {
      social: { main: textColor },
      bgColor: { main: backgroundColor },
      highlightedFrames: { main: highlightedFramesColor },
    },
    typography: { secondaryFont: fontFamily },
  } = useTheme();
  const { lineColor, areaTopColor, areaBottomColor } = COLORS;

  const [tooltipContent, setTooltipContent] = useState<DataPointTooltip>({
    date: null,
    fields: null,
    isVisible: false,
    x: 0,
    y: 0,
  });

  const throttledResize = useCallback(
    throttle(() => {
      setToggleResize((prev) => !prev);
    }, RESIZE_THROTTLE_MS),
    [],
  );

  const handleResize = useCallback(() => {
    throttledResize();
  }, [setToggleResize]);

  useResizeObserver({
    containerRef: containerRef,
    onResize: handleResize,
  });

  const getSeriesDataTooltipFields = useCallback(
    <SeriesData extends { time: Time; value: number }>(
      seriesData?: SeriesData,
    ): Record<string, string> => {
      const timeSeriesValue = seriesData?.value;
      const trimmedValue = timeSeriesValue
        ? trimTrailingZeros(roundNumber(timeSeriesValue, priceAsset.decimalPrecision))
        : null;
      const formattedValue = trimmedValue
        ? `${trimmedValue} ${priceAsset.shortName}`
        : '-';

      return {
        ['Price']: formattedValue,
      };
    },
    [priceAsset],
  );

  useEffect(() => {
    if (chartRef.current) {
      const chartOptionsParams: ChartOptionsParams = {
        backgroundColor,
        textColor,
        highlightedFramesColor,
        fontFamily,
        displayHoursAndMinutes,
        chartWidth: containerRef.current?.clientWidth,
        chartType: ChartType.line,
      };
      const chartOptions = getChartOptions(chartOptionsParams);

      const chart = createChart(chartRef.current, chartOptions);

      const newSeries = chart.addAreaSeries({
        lineColor,
        topColor: areaTopColor,
        bottomColor: areaBottomColor,
      });

      chart.timeScale().fitContent();

      const timeSeriesDataPointsWithFormattedTime = timeSeriesDataPoints.map(
        (dataPoint: TimeSeriesLineChartDataPoint) => ({
          ...dataPoint,
          time: convertAndFormatTime(dataPoint.time),
        }),
      );

      newSeries.setData(timeSeriesDataPointsWithFormattedTime);

      const crosshairMoveHandler = createCrosshairMoveHandler(
        setTooltipContent,
        newSeries,
        getSeriesDataTooltipFields,
      );
      chart.subscribeCrosshairMove(crosshairMoveHandler);

      chartRef.current.chart = chart;

      return () => {
        chart.unsubscribeCrosshairMove(crosshairMoveHandler);
        chart.remove();
      };
    }
  }, [timeSeriesDataPoints, toggleResize]);

  return (
    <Grid position="relative" ref={containerRef}>
      <Grid ref={chartRef} />
      <ChartTooltip tooltipContent={tooltipContent} />
    </Grid>
  );
};

export default React.memo(LineChart, isEqual);
