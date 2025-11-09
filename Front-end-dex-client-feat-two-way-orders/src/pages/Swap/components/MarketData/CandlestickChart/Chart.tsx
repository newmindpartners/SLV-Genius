import { Grid, useTheme } from '@mui/material';
import { createChart, IChartApi, SeriesDataItemTypeMap } from 'lightweight-charts';
import { isEqual, throttle } from 'lodash';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import { ChartTooltip, DataPointTooltip } from '~/components/ChartTooltip';
import useResizeObserver from '~/hooks/misc/useResizeObserver';

import {
  ChartOptionsParams,
  convertAndFormatTime,
  createCrosshairMoveHandler,
  getChartOptions,
} from '../chartUtils';
import { ChartType } from '../utils';

export type TimeSeriesDataPoint = SeriesDataItemTypeMap['Candlestick'];

type LineChartProps = {
  timeSeriesDataPoints: TimeSeriesDataPoint[];
  displayHoursAndMinutes: boolean;
};

type ChartContainerElement = HTMLDivElement & {
  chart?: IChartApi;
};

const RESIZE_THROTTLE_MS = 10;

export const LineChart: FC<LineChartProps> = ({
  timeSeriesDataPoints,
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

  useEffect(() => {
    if (chartRef.current) {
      const chartOptionsParams: ChartOptionsParams = {
        backgroundColor,
        textColor,
        highlightedFramesColor,
        fontFamily,
        displayHoursAndMinutes,
        chartWidth: containerRef.current?.clientWidth,
        chartType: ChartType.candlestick,
      };
      const chartOptions = getChartOptions(chartOptionsParams);

      const chart = createChart(chartRef.current, chartOptions);
      const newSeries = chart.addCandlestickSeries();

      chart.timeScale().fitContent();

      const timeSeriesDataPointsWithFormattedTime = timeSeriesDataPoints.map(
        (dataPoint: TimeSeriesDataPoint) => ({
          ...dataPoint,
          time: convertAndFormatTime(dataPoint.time),
        }),
      );

      newSeries.setData(timeSeriesDataPointsWithFormattedTime);

      const crosshairMoveHandler = createCrosshairMoveHandler(
        setTooltipContent,
        newSeries as never,
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
