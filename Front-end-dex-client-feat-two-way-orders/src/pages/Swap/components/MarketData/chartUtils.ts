import { alpha, Theme } from '@mui/material';
import { addMinutes, fromUnixTime, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import {
  AreaData,
  AreaSeriesOptions,
  AreaStyleOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
  IChartApi,
  isBusinessDay,
  ISeriesApi,
  isUTCTimestamp,
  LineStyle,
  MouseEventParams,
  SeriesOptionsCommon,
  Time,
  UTCTimestamp,
  WhitespaceData,
} from 'lightweight-charts';
import { MutableRefObject } from 'react';
import { DataPointTooltip } from '~/components/ChartTooltip';
import { formatDate, formatDateWithTime } from '~/utils/dateUtils';

import { ChartType } from './utils';

export const COLORS = {
  lineColor: '#4C54F5',
  areaTopColor: 'rgba(76, 84, 245, 0.8)',
  areaBottomColor: 'rgba(9, 13, 20, 0.8)',
};

export type ChartOptionsParams = {
  backgroundColor: string;
  textColor: string;
  highlightedFramesColor: string;
  fontFamily: string;
  displayHoursAndMinutes: boolean;
  chartWidth: number | undefined;
  chartType: ChartType;
};

export const getChartOptions = ({
  backgroundColor,
  textColor,
  highlightedFramesColor,
  fontFamily,
  displayHoursAndMinutes,
  chartWidth,
  chartType,
}: ChartOptionsParams): DeepPartial<ChartOptions> => ({
  layout: {
    background: {
      type: ColorType.Solid,
      color: backgroundColor,
    },
    textColor: textColor,
    fontSize: 12,
    fontFamily: fontFamily,
  },
  grid: {
    vertLines: { visible: false },
    horzLines: {
      color: highlightedFramesColor,
      style: LineStyle.LargeDashed,
    },
  },
  timeScale: {
    fixLeftEdge: true,
    fixRightEdge: true,
    timeVisible: displayHoursAndMinutes ? true : false,
    ...(chartType === ChartType.line
      ? {
          borderVisible: false,
        }
      : {}),
  },
  rightPriceScale: {
    visible: true,
  },
  width: chartWidth,
  height: 470,
  crosshair: {
    vertLine: {
      color: COLORS.lineColor,
      width: 1,
      style: LineStyle.Solid,
      ...(chartType === ChartType.line
        ? {
            labelVisible: false,
          }
        : {}),
    },
    ...(chartType === ChartType.line
      ? {
          horzLine: {
            visible: false,
            labelVisible: false,
          },
        }
      : {}),
  },
  ...(chartType === ChartType.line
    ? {
        handleScale: {
          axisPressedMouseMove: { time: false, price: false },
          mouseWheel: false,
          pinch: false,
        },
      }
    : {}),
});

export const getDefaultChartOptions = (theme: Theme): DeepPartial<ChartOptions> => ({
  autoSize: true,
  grid: {
    horzLines: {
      style: LineStyle.Dashed,
      color: alpha(theme.palette.text.secondary, 0.25),
    },
    vertLines: {
      visible: false,
    },
  },
  handleScale: false,
  handleScroll: false,
  layout: {
    background: { type: ColorType.Solid, color: 'rgba(0, 0, 0, 0)' },
    textColor: theme.palette.text.secondary,
  },
});

export const formatTimeToDateString = (time: Time): string => {
  if (typeof time === 'string') {
    return formatDateWithTime(parseISO(time));
  } else if (isBusinessDay(time)) {
    // Convert business day to a UTC date to avoid local timezone issues
    const businessDayUTC = new Date(Date.UTC(time.year, time.month - 1, time.day));

    // Adjust the UTC date to the 'UTC' timezone to ensure consistent formatting
    const businessDayAdjusted = utcToZonedTime(businessDayUTC, 'UTC');

    return formatDateWithTime(businessDayAdjusted);
  } else if (isUTCTimestamp(time)) {
    // Convert Unix timestamp to a UTC date to avoid local timezone issues
    const timestampUTC = fromUnixTime(Number(time));

    // Adjust the UTC date to the 'UTC' timezone to ensure consistent formatting
    const timestampAdjusted = utcToZonedTime(timestampUTC, 'UTC');

    return formatDateWithTime(timestampAdjusted);
  }

  const neverTime: never = time;
  return neverTime;
};

// Type taken from Lightweight Chart types
type NewSeriesType = ISeriesApi<
  'Area',
  Time,
  AreaData<Time> | WhitespaceData<Time>,
  AreaSeriesOptions,
  DeepPartial<AreaStyleOptions & SeriesOptionsCommon>
>;

export const createCrosshairMoveHandler =
  (
    setTooltipContent: React.Dispatch<React.SetStateAction<DataPointTooltip>>,
    newSeries: NewSeriesType,
    getSeriesDataTooltipFields?: <SeriesData extends { time: Time; value: number }>(
      seriesData?: SeriesData,
    ) => Record<string, string>,
  ) =>
  (param: MouseEventParams) => {
    if (param.time && param.point && param.seriesData.size > 0) {
      const seriesData = param.seriesData.get(newSeries);

      if (seriesData && 'value' in seriesData) {
        const fields = getSeriesDataTooltipFields?.(seriesData) || null;

        setTooltipContent({
          date: formatTimeToDateString(param.time),
          fields,
          isVisible: true,
          x: param.point.x - 80,
          y: param.point.y,
        });
      }
    } else {
      setTooltipContent((prev: DataPointTooltip) => ({ ...prev, isVisible: false }));
    }
  };

export type ChartContainerElement = HTMLDivElement & {
  chart?: IChartApi;
};

export const resizeChart = (
  chartContainerRef: MutableRefObject<ChartContainerElement | null>,
) => {
  const chartElement = chartContainerRef.current;
  if (chartElement && chartElement.chart) {
    chartElement.chart.applyOptions({
      width: chartElement.clientWidth,
      height: chartElement.clientHeight,
    });
    chartElement.chart.timeScale().fitContent();
  }
};

const localTimezoneOffset = new Date().getTimezoneOffset();

export const convertAndFormatTime = (time: Time): Time => {
  if (typeof time === 'string') {
    return formatDate(addMinutes(new Date(time), -localTimezoneOffset));
  } else if (isBusinessDay(time)) {
    const adjustedBusinessDate = new Date(time.year, time.month - 1, time.day);
    return formatDateWithTime(adjustedBusinessDate);
  } else if (isUTCTimestamp(time)) {
    const dateFromTimestamp = new Date(Number(time) * 1000);
    const adjustedDate = addMinutes(dateFromTimestamp, -localTimezoneOffset);
    const adjustedTimestamp = Math.floor(adjustedDate.getTime() / 1000) as UTCTimestamp;
    return adjustedTimestamp;
  }

  const neverTime: never = time;
  return neverTime;
};
