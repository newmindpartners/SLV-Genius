import { SeriesDataItemTypeMap } from 'lightweight-charts';
import { filter } from 'lodash';
import { IChartItem } from '~/pages/Leaderboard/types/IChartItem';

export const filterWhitespaces = (data: SeriesDataItemTypeMap['Line'][]) =>
  filter(data, (point) => 'value' in point && point.value !== undefined);

export const filterTradingWalletWhiteSpace = (data: IChartItem[]) =>
  filter(data, (point) => 'value' in point && point.value !== undefined);

export const MIN_DATA_SIZE_TO_DISPLAY_CHART = 10;
