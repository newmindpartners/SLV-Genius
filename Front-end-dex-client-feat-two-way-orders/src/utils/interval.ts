import { IOption } from '~/types/option';

export enum IntervalType {
  OneDay = '1D',
  SevenDays = '7D',
  OneMonth = '1M',
  ThreeMonth = '3M',
  SixMonths = '6M',
  OneYear = '1Y',
}

export enum IntervalLabelType {
  Long,
  Short,
}

export type IntervalDurationMap = {
  [type in IntervalType]: number | null;
};

export type IntervalLabelMap = {
  [labelType in IntervalLabelType]: {
    [type in IntervalType]: string;
  };
};

export const intervalDurationMap: IntervalDurationMap = {
  [IntervalType.OneDay]: 24 * 60 * 60 * 1000,
  [IntervalType.SevenDays]: 7 * 24 * 60 * 60 * 1000,
  [IntervalType.OneMonth]: 30 * 24 * 60 * 60 * 1000,
  [IntervalType.ThreeMonth]: 90 * 24 * 60 * 60 * 1000,
  [IntervalType.SixMonths]: 180 * 24 * 60 * 60 * 1000,
  [IntervalType.OneYear]: 365 * 24 * 60 * 60 * 1000,
};

export const intervalLabelMap: IntervalLabelMap = {
  [IntervalLabelType.Long]: {
    [IntervalType.OneDay]: 'Day',
    [IntervalType.SevenDays]: 'Week',
    [IntervalType.OneMonth]: 'Month',
    [IntervalType.ThreeMonth]: '3 Months',
    [IntervalType.SixMonths]: '6 Months',
    [IntervalType.OneYear]: 'Year',
  },
  [IntervalLabelType.Short]: {
    [IntervalType.OneDay]: '1D',
    [IntervalType.SevenDays]: '7D',
    [IntervalType.OneMonth]: '1M',
    [IntervalType.ThreeMonth]: '3M',
    [IntervalType.SixMonths]: '6M',
    [IntervalType.OneYear]: '1Y',
  },
};

export const getIntervalDuration = (type: IntervalType): number | null => {
  return intervalDurationMap[type];
};

export const getIntervalOptions = (
  intervalTypes: IntervalType[],
  labelType: IntervalLabelType,
): IOption<IntervalType>[] =>
  intervalTypes.map((intervalType) => ({
    value: intervalType,
    label: intervalLabelMap[labelType][intervalType],
  }));
