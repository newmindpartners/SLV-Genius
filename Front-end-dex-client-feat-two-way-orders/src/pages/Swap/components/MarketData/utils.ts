import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns';

export enum ChartType {
  line = 'Line',
  candlestick = 'Candlestick',
}

export enum TimeInterval {
  OneDay = '1D',
  SevenDays = '7D',
  OneMonth = '1M',
  ThreeMonths = '3M',
  SixMonths = '6M',
  OneYear = '1Y',
}

export const timeframes: TimeInterval[] = [
  TimeInterval.OneDay,
  TimeInterval.SevenDays,
  TimeInterval.OneMonth,
  TimeInterval.SixMonths,
  TimeInterval.OneYear,
];

export const swapChartTypes: ChartType[] = [ChartType.line, ChartType.candlestick];

export enum BinInterval {
  FifteenMinutes = '15m',
  ThirteenMinutes = '30m',
  OneHour = '1h',
  FourHours = '4h',
  OneDay = '1d',
  OneWeek = '1w',
}

export const calculateChartsBinInterval = (startTime: string, endTime: string) => {
  const diffWeeks = differenceInWeeks(new Date(endTime), new Date(startTime));
  const diffDays = differenceInDays(new Date(endTime), new Date(startTime));
  const diffMonths = differenceInMonths(new Date(endTime), new Date(startTime));
  const diffYears = differenceInYears(new Date(endTime), new Date(startTime));

  switch (true) {
    case diffDays <= 1:
      return BinInterval.FifteenMinutes;
    case diffWeeks <= 1:
      return BinInterval.OneHour;
    case diffMonths <= 1:
      return BinInterval.FourHours;
    case diffMonths <= 6:
      return BinInterval.OneDay;
    case diffYears <= 1:
      return BinInterval.OneWeek;
    default:
      return BinInterval.FifteenMinutes;
  }
};

export const BIN_INTERVAL_MAP: Record<BinInterval, number> = {
  '15m': 15 * 60 * 1000, // Intervals in milliseconds
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
};

export const BIN_INTERVAL_MIN_LIMIT = 25;
export const BIN_INTERVAL_MAX_LIMIT = 800;

export const isBinInterval = (value: unknown): value is BinInterval => {
  if (Object.values(BinInterval).includes(value as BinInterval)) {
    return true;
  } else {
    throw new Error('Set value is not valid bin interval');
  }
};
