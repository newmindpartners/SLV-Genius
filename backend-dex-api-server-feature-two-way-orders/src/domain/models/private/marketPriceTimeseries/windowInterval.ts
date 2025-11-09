const windowIntervals = ['1d', '1w', '1mo', '3mo', '6mo', '1y'] as const;

export type WindowInterval = (typeof windowIntervals)[number];

export const isWindowInterval = (
  interval: string
): interval is WindowInterval =>
  windowIntervals.includes(interval as WindowInterval);
