import {subDays, subHours, subMinutes, subWeeks} from 'date-fns';
import * as Private from '~/domain/models/private';

const BIN_INTERVAL_MAP: Record<Private.BinInterval, number> = {
  '15m': 15 * 60 * 1000, // Intervals in miliseconds
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
};

const BIN_INTERVAL_MIN_LIMIT = 25;
const BIN_INTERVAL_MAX_LIMIT = 800;

const getMaximumBinAmount = (
  startTimeDate: Date,
  endTimeDate: Date,
  binInterval: Private.BinInterval
): number => {
  const start = startTimeDate.getTime();
  const end = endTimeDate.getTime();
  const durationMs = end - start;

  const binSizeMs = BIN_INTERVAL_MAP[binInterval];

  return Math.floor(durationMs / binSizeMs);
};

export const isValidBinInterval = (
  startTimeDate: Date,
  endTimeDate: Date,
  binInterval: Private.BinInterval
): boolean => {
  const bins = getMaximumBinAmount(startTimeDate, endTimeDate, binInterval);

  return bins >= BIN_INTERVAL_MIN_LIMIT && bins <= BIN_INTERVAL_MAX_LIMIT;
};

export const subtractBinIntervalDuration = (
  time: Date,
  binInterval: Private.BinInterval
): Date => {
  switch (binInterval) {
    case '15m':
      return subMinutes(time, 15);
    case '30m':
      return subMinutes(time, 30);
    case '1h':
      return subHours(time, 1);
    case '4h':
      return subHours(time, 4);
    case '1d':
      return subDays(time, 1);
    case '1w':
      return subWeeks(time, 1);
  }
};
