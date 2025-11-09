import * as d3Import from 'd3';
import {filter, first, flatMap, lt, reduce, sum, takeRight} from 'lodash';
import * as loFp from 'lodash/fp';
import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';

type GetBoundReduce = {
  bound: number | null | undefined;
  gapIdentified: boolean;
  rollingWindow: d3.Bin<number, number>[];
};

type MinBinBoundKey = 'x0';
type MaxBinBoundKey = 'x1';
type MinMaxBinBoundKeys = MinBinBoundKey | MaxBinBoundKey;

// Prevent ts-node from transpiling `import` to `require` which breaks esm async import
const dynamicImport = new Function('specifier', 'return import(specifier)');

const getBinningFunc = async (binChunks: number) => {
  const d3: typeof d3Import = await dynamicImport('d3');

  const bin = d3
    .bin()
    .thresholds((data, min, max) =>
      d3.range(binChunks).map(t => min + (t / binChunks) * (max - min))
    );

  return bin;
};

// Find bound at first gap of proportion found
const getBound = (
  bins: d3.Bin<number, number>[],
  gapProportion: number,
  gapIgnoreProportion: number,
  minMaxKey: MinMaxBinBoundKeys
) => {
  const gapNumberOfBins = Math.ceil(gapProportion * bins.length);
  const totalBinSamples = sum(flatMap(bins, bin => bin.length));
  const gapIgnoreSampleTolerance = Math.ceil(
    gapIgnoreProportion * totalBinSamples
  );

  const result = reduce(
    bins,
    (result: GetBoundReduce, item) => {
      const {gapIdentified, bound, rollingWindow} = result;

      const newRollingWindow: d3.Bin<number, number>[] = takeRight(
        [...rollingWindow, item],
        gapNumberOfBins
      );

      const newRollingWindowSampleCount = flatMap(
        newRollingWindow,
        item => item.length
      );
      const newRollingWindowTotalSampleCount = sum(newRollingWindowSampleCount);

      // If the number of bins representative of gap are present
      // and the number of samples are less than tolerance limit
      // then gap identified
      const newGapIdentified: boolean =
        !gapIdentified &&
        newRollingWindow.length === gapNumberOfBins &&
        newRollingWindowTotalSampleCount < gapIgnoreSampleTolerance;

      // Find bound at head of window to ensure tolerance values are excluded.
      const newBound = newGapIdentified
        ? first(newRollingWindow)?.[minMaxKey]
        : bound;

      return {
        rollingWindow: newRollingWindow,
        bound: newBound,
        gapIdentified: newGapIdentified ? newGapIdentified : gapIdentified,
      };
    },
    {
      rollingWindow: [],
      bound: null,
      gapIdentified: false,
    }
  );
  return result['bound'];
};

const filterDataByHighBound =
  <T>(highBound: number | null | undefined, key: keyof T) =>
  (item: T) => {
    if (item[key] === null) {
      return true;
    }
    return highBound ? lt(item[key], highBound) : true;
  };

const filterByBound =
  <T>(
    gapProportion: number,
    gapIgnoreProportion: number,
    binFunc: d3.HistogramGeneratorNumber<number, number>,
    dataKey: keyof T
  ) =>
  (data: T[]) => {
    const binMinBoundKey = 'x0';

    const binData = loFp.flow(
      loFp.map((sample: T) => sample[dataKey]),
      loFp.filter((sample: T) => sample !== null),
      binFunc
    )(data);

    const highBound = getBound(
      binData,
      gapProportion,
      gapIgnoreProportion,
      binMinBoundKey
    );

    const filteredData: T[] = filter(
      data,
      filterDataByHighBound(highBound, dataKey)
    );

    return filteredData;
  };

const noDataFilteredData = <T>(data: T[], filteredData: T[]) =>
  filteredData.length < data.length;

const recursiveFilter =
  <T, FT extends (...args: any[]) => any>(
    func: FT,
    funcArg: Parameters<FT>,
    recursiveLimit: number,
    count = 0
  ) =>
  (data: T[]): T[] => {
    const filteredData = func(...funcArg)(data);
    if (noDataFilteredData<T>(data, filteredData) && count <= recursiveLimit)
      return recursiveFilter<T, FT>(
        func,
        funcArg,
        recursiveLimit,
        count + 1
      )(filteredData);
    else return filteredData;
  };

export const filterPriceData = async <T>(
  binChunks: number,
  gapProportion: number,
  gapIgnoreProportion: number,
  data: T[],
  dataKey: keyof T
) => {
  if (gapProportion >= 1 || gapIgnoreProportion >= 1)
    throw new ApplicationError(ErrorCode.DATA_FILTER__INVALID_ARGUMENT);

  const binFunc = await getBinningFunc(binChunks);

  const recursionLimit = 4;
  const filteredData = recursiveFilter<T, typeof filterByBound<T>>(
    filterByBound,
    [gapProportion, gapIgnoreProportion, binFunc, dataKey],
    recursionLimit
  )(data);

  return filteredData;
};
