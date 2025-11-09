const binIntervals = ['15m', '30m', '1h', '4h', '1d', '1w'] as const;

export type BinInterval = (typeof binIntervals)[number];

export const isBinInterval = (interval: string): interval is BinInterval =>
  binIntervals.includes(interval as BinInterval);
