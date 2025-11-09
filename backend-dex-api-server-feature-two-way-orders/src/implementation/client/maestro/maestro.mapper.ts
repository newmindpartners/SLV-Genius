import {map} from 'lodash';
import {MaestroCoinSelect, MaestroOhlc, Ohlc} from './maestro.client';

export const toOhlc = (
  coinSelect: MaestroCoinSelect,
  maestroOhlc: MaestroOhlc[]
) => {
  const data: Ohlc[] = map(maestroOhlc, item => ({
    open: item[`${coinSelect}open`],
    high: item[`${coinSelect}high`],
    low: item[`${coinSelect}low`],
    close: item[`${coinSelect}close`],
    time: item.timestamp,
  }));
  return data;
};
