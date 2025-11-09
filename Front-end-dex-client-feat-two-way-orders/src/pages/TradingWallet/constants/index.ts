import { IOption } from '~/types/option';
import { getIntervalOptions, IntervalLabelType, IntervalType } from '~/utils/interval';

import { ChartMode } from '../types/ChartMode';
import { OrderFilter } from '../types/OrderFilter';

export const chartModeOptions: IOption<ChartMode>[] = [
  { label: 'Earned', value: ChartMode.Earned },
  { label: 'ROI', value: ChartMode.ROI },
];

export const chartIntervalOptions = getIntervalOptions(
  [
    IntervalType.OneDay,
    IntervalType.SevenDays,
    IntervalType.OneMonth,
    IntervalType.ThreeMonth,
    IntervalType.SixMonths,
    IntervalType.OneYear,
  ],
  IntervalLabelType.Short,
);

export const orderFilterOptions: IOption<OrderFilter>[] = [
  { label: 'All', value: OrderFilter.All },
  { label: 'Open', value: OrderFilter.Open },
  { label: 'History', value: OrderFilter.History },
];
