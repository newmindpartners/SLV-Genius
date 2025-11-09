import {isNumber, last} from 'lodash';
import * as Private from '~/domain/models/private';
import {WithRequired} from '~/implementation/utils/typescript';

type ProfitabilityAccumulationResult = {
  accumulation: Private.InternalProfitabilityAccumulationData[];
  previousWithData: Required<Private.InternalProfitabilityAccumulationData> | null;
};

const isBuyPresent = ({
  totalBuyToAmountFilled,
  totalBuyFromAmountFilled,
}: Private.BinFillsData) =>
  isNumber(totalBuyToAmountFilled) && isNumber(totalBuyFromAmountFilled);

const isSellPresent = ({
  totalSellToAmountFilled,
  totalSellFromAmountFilled,
}: Private.BinFillsData) =>
  isNumber(totalSellToAmountFilled) && isNumber(totalSellFromAmountFilled);

const isPricePresent = ({internalMarketPrice}: Private.BinFillsData) =>
  isNumber(internalMarketPrice);

const isExternalMarketPricePresent = (
  data: Private.StitchedTimeseriesBinFillsData
): data is WithRequired<
  Private.StitchedTimeseriesBinFillsData,
  'externalMarketPrice'
> => isNumber(data.externalMarketPrice);

const isSomeFeesPresent = (data: Private.BinFillsData) =>
  isNumber(data.totalOpenTransactionFeeAmount) ||
  isNumber(data.totalCancelTransactionFeeAmount) ||
  isNumber(data.totalMakerAdaFlatFeeAmount) ||
  isNumber(data.totalBuyMakerFromAssetFeeAmount) ||
  isNumber(data.totalSellMakerFromAssetFeeAmount);

const isBinFillsDataPresent = (binFillsData: Private.BinFillsData) =>
  ((isBuyPresent(binFillsData) || isSellPresent(binFillsData)) &&
    isPricePresent(binFillsData)) ||
  isSomeFeesPresent(binFillsData);

const isStitchedBinFillsDataPresent = (
  data: Private.StitchedTimeseriesBinFillsData
): data is WithRequired<
  Private.StitchedTimeseriesBinFillsData,
  'externalMarketPrice'
> => isBinFillsDataPresent(data) && isExternalMarketPricePresent(data);

export const isBinnedOrdersMetricsPresent = (
  binnedOrdersMetrics: Private.MarketMakerBinnedOrdersMetrics
): binnedOrdersMetrics is Required<Private.MarketMakerBinnedOrdersMetrics> =>
  isNumber(binnedOrdersMetrics.roiPercent) &&
  isNumber(binnedOrdersMetrics.earnedPriceAssetAmount);

const getBinAssetsBoughtSold = (
  newData: Private.StitchedTimeseriesBinFillsData
): Pick<
  Required<Private.InternalProfitabilityAccumulationData>,
  | 'assetOneAmountBought'
  | 'assetTwoAmountBought'
  | 'assetOneAmountSold'
  | 'assetTwoAmountSold'
> => {
  return {
    assetOneAmountBought: newData.totalBuyToAmountFilled || 0,
    assetTwoAmountBought: newData.totalSellToAmountFilled || 0,
    assetOneAmountSold: newData.totalSellFromAmountFilled || 0,
    assetTwoAmountSold: newData.totalBuyFromAmountFilled || 0,
  };
};

const getBinAssetsNetPositions = (
  newData: Private.StitchedTimeseriesBinFillsData
): {
  assetOneAmountNetPosition: number;
  assetTwoAmountNetPosition: number;
} => {
  const {
    assetOneAmountBought,
    assetTwoAmountBought,
    assetOneAmountSold,
    assetTwoAmountSold,
  } = getBinAssetsBoughtSold(newData);

  return {
    assetOneAmountNetPosition: assetOneAmountBought - assetOneAmountSold,
    assetTwoAmountNetPosition: assetTwoAmountBought - assetTwoAmountSold,
  };
};

const getBinEarnedPriceAssetAmount = (
  newData: WithRequired<
    Private.StitchedTimeseriesBinFillsData,
    'externalMarketPrice'
  >
): number => {
  const {assetOneAmountNetPosition, assetTwoAmountNetPosition} =
    getBinAssetsNetPositions(newData);

  return (
    assetOneAmountNetPosition * newData.externalMarketPrice +
    assetTwoAmountNetPosition
  );
};

const getAccumulativeAssetsBoughtSold = (
  newData: Private.StitchedTimeseriesBinFillsData,
  prevData: Private.InternalProfitabilityAccumulationData | null
): Pick<
  Required<Private.InternalProfitabilityAccumulationData>,
  | 'accumulativeAssetOneAmountBought'
  | 'accumulativeAssetTwoAmountBought'
  | 'accumulativeAssetOneAmountSold'
  | 'accumulativeAssetTwoAmountSold'
> => {
  const {
    assetOneAmountBought,
    assetTwoAmountBought,
    assetOneAmountSold,
    assetTwoAmountSold,
  } = getBinAssetsBoughtSold(newData);

  const prevAccumulativeAssetOneAmountBought =
    prevData?.accumulativeAssetOneAmountBought || 0;
  const prevAccumulativeAssetTwoAmountBought =
    prevData?.accumulativeAssetTwoAmountBought || 0;
  const prevAccumulativeAssetOneAmountSold =
    prevData?.accumulativeAssetOneAmountSold || 0;
  const prevAccumulativeAssetTwoAmountSold =
    prevData?.accumulativeAssetTwoAmountSold || 0;

  const accumulativeAssetOneAmountBought =
    prevAccumulativeAssetOneAmountBought + assetOneAmountBought;

  const accumulativeAssetTwoAmountBought =
    prevAccumulativeAssetTwoAmountBought + assetTwoAmountBought;

  const accumulativeAssetOneAmountSold =
    prevAccumulativeAssetOneAmountSold + assetOneAmountSold;

  const accumulativeAssetTwoAmountSold =
    prevAccumulativeAssetTwoAmountSold + assetTwoAmountSold;

  return {
    accumulativeAssetOneAmountBought,
    accumulativeAssetTwoAmountBought,
    accumulativeAssetOneAmountSold,
    accumulativeAssetTwoAmountSold,
  };
};

const getAccumulativeAssetsBoughtCount = (
  newData: WithRequired<
    Private.StitchedTimeseriesBinFillsData,
    'externalMarketPrice'
  >,
  prevData: Private.InternalProfitabilityAccumulationData | null
): Pick<
  Required<Private.InternalProfitabilityAccumulationData>,
  'accumulativeAssetOneBoughtCount' | 'accumulativeAssetTwoBoughtCount'
> => {
  const assetOneBoughtCount = newData.totalBuyCount || 0;
  const assetTwoBoughtCount = newData.totalSellCount || 0;

  const prevAccumulativeAssetOneBoughtCount =
    prevData?.accumulativeAssetOneBoughtCount || 0;
  const prevAccumulativeAssetTwoBoughtCount =
    prevData?.accumulativeAssetTwoBoughtCount || 0;

  return {
    accumulativeAssetOneBoughtCount:
      prevAccumulativeAssetOneBoughtCount + assetOneBoughtCount,
    accumulativeAssetTwoBoughtCount:
      prevAccumulativeAssetTwoBoughtCount + assetTwoBoughtCount,
  };
};

const getAccumulativeAssetsNetPositions = (
  newData: WithRequired<
    Private.StitchedTimeseriesBinFillsData,
    'externalMarketPrice'
  >,
  prevData: Private.InternalProfitabilityAccumulationData | null
): Pick<
  Required<Private.InternalProfitabilityAccumulationData>,
  | 'accumulativeAssetOneAmountNetPosition'
  | 'accumulativeAssetTwoAmountNetPosition'
> => {
  const {assetOneAmountNetPosition, assetTwoAmountNetPosition} =
    getBinAssetsNetPositions(newData);

  const prevAccumulativeAssetOneAmountNetPosition =
    prevData?.accumulativeAssetOneAmountNetPosition || 0;
  const prevAccumulativeAssetTwoAmountNetPosition =
    prevData?.accumulativeAssetTwoAmountNetPosition || 0;

  const accumulativeAssetOneAmountNetPosition =
    prevAccumulativeAssetOneAmountNetPosition + assetOneAmountNetPosition;

  const accumulativeAssetTwoAmountNetPosition =
    prevAccumulativeAssetTwoAmountNetPosition + assetTwoAmountNetPosition;

  return {
    accumulativeAssetOneAmountNetPosition,
    accumulativeAssetTwoAmountNetPosition,
  };
};

const getAccumulativeBoughtInPriceAssetAmount = (
  newData: WithRequired<
    Private.StitchedTimeseriesBinFillsData,
    'externalMarketPrice'
  >,
  prevData: Private.InternalProfitabilityAccumulationData | null
): number => {
  const {assetOneAmountBought, assetTwoAmountBought} =
    getBinAssetsBoughtSold(newData);

  const prevAccumulativeBoughtInPriceAssetAmount =
    prevData?.accumulativeBoughtInPriceAssetAmount || 0;

  return (
    prevAccumulativeBoughtInPriceAssetAmount +
    assetOneAmountBought * newData.externalMarketPrice +
    assetTwoAmountBought
  );
};

const getBinAssetsFees = (
  newData: Omit<Private.StitchedTimeseriesBinFillsData, 'timestamp'>
): {
  totalOpenTransactionFeeAmount: number;
  totalCancelTransactionFeeAmount: number;
  totalBuyMakerFromAssetFeeAmount: number;
  totalSellMakerFromAssetFeeAmount: number;
  totalMakerAdaFlatFeeAmount: number;
} => {
  return {
    totalOpenTransactionFeeAmount: newData.totalOpenTransactionFeeAmount || 0,
    totalCancelTransactionFeeAmount:
      newData.totalCancelTransactionFeeAmount || 0,
    totalBuyMakerFromAssetFeeAmount:
      newData.totalBuyMakerFromAssetFeeAmount || 0,
    totalSellMakerFromAssetFeeAmount:
      newData.totalSellMakerFromAssetFeeAmount || 0,
    totalMakerAdaFlatFeeAmount: newData.totalMakerAdaFlatFeeAmount || 0,
  };
};

const getAccumulativeFees = (
  newData: Omit<Private.StitchedTimeseriesBinFillsData, 'timestamp'>,
  prevData: Private.InternalProfitabilityAccumulationData | null
): Pick<
  Required<Private.InternalProfitabilityAccumulationData>,
  | 'accumulativeTotalOpenTransactionFeeAmount'
  | 'accumulativeTotalCancelTransactionFeeAmount'
  | 'accumulativeTotalBuyMakerFromAssetFeeAmount'
  | 'accumulativeTotalSellMakerFromAssetFeeAmount'
  | 'accumulativeTotalMakerAdaFlatFeeAmount'
> => {
  const prevAccumulativeTotalOpenTransactionFeeAmount =
    prevData?.accumulativeTotalOpenTransactionFeeAmount || 0;
  const prevAccumulativeTotalCancelTransactionFeeAmount =
    prevData?.accumulativeTotalCancelTransactionFeeAmount || 0;
  const prevAccumulativeTotalBuyMakerFromAssetFeeAmount =
    prevData?.accumulativeTotalBuyMakerFromAssetFeeAmount || 0;
  const prevAccumulativeTotalSellMakerFromAssetFeeAmount =
    prevData?.accumulativeTotalSellMakerFromAssetFeeAmount || 0;
  const prevAccumulativeTotalMakerAdaFlatFeeAmount =
    prevData?.accumulativeTotalMakerAdaFlatFeeAmount || 0;

  const {
    totalOpenTransactionFeeAmount,
    totalCancelTransactionFeeAmount,
    totalBuyMakerFromAssetFeeAmount,
    totalSellMakerFromAssetFeeAmount,
    totalMakerAdaFlatFeeAmount,
  } = getBinAssetsFees(newData);

  return {
    accumulativeTotalOpenTransactionFeeAmount:
      prevAccumulativeTotalOpenTransactionFeeAmount +
      totalOpenTransactionFeeAmount,
    accumulativeTotalCancelTransactionFeeAmount:
      prevAccumulativeTotalCancelTransactionFeeAmount +
      totalCancelTransactionFeeAmount,
    accumulativeTotalBuyMakerFromAssetFeeAmount:
      prevAccumulativeTotalBuyMakerFromAssetFeeAmount +
      totalBuyMakerFromAssetFeeAmount,
    accumulativeTotalSellMakerFromAssetFeeAmount:
      prevAccumulativeTotalSellMakerFromAssetFeeAmount +
      totalSellMakerFromAssetFeeAmount,
    accumulativeTotalMakerAdaFlatFeeAmount:
      prevAccumulativeTotalMakerAdaFlatFeeAmount + totalMakerAdaFlatFeeAmount,
  };
};

const getAccumulativeAssetsFees = (
  newData: Omit<Private.StitchedTimeseriesBinFillsData, 'timestamp'>,
  prevData: Private.InternalProfitabilityAccumulationData | null
): Pick<
  Required<Private.InternalProfitabilityAccumulationData>,
  'accumulativeAssetOneFeesAmount' | 'accumulativeAssetTwoFeesAmount'
> => {
  const {
    accumulativeTotalOpenTransactionFeeAmount,
    accumulativeTotalCancelTransactionFeeAmount,
    accumulativeTotalBuyMakerFromAssetFeeAmount,
    accumulativeTotalSellMakerFromAssetFeeAmount,
    accumulativeTotalMakerAdaFlatFeeAmount,
  } = getAccumulativeFees(newData, prevData);

  const accumulativeAssetOneFeesAmount =
    accumulativeTotalSellMakerFromAssetFeeAmount;

  const accumulativeAssetTwoFeesAmount =
    accumulativeTotalOpenTransactionFeeAmount +
    accumulativeTotalCancelTransactionFeeAmount +
    accumulativeTotalBuyMakerFromAssetFeeAmount +
    accumulativeTotalMakerAdaFlatFeeAmount;

  return {
    accumulativeAssetOneFeesAmount,
    accumulativeAssetTwoFeesAmount,
  };
};

export class MarketDataService {
  /**
   * It was a recurring problem that the above checking functions were undefined in certain
   * execution scopes. Rather than figure out why they were suddenly undefined I just made them
   * pure lampba functions.
   * However to maintain the interface to this service, I chose to export it like this.
   */
  public isBinFillsDataPresent = isBinFillsDataPresent;

  public getLastPresentBinnedOrdersMetrics(
    metrics: Private.MarketMakerBinnedOrdersMetrics[]
  ): Private.MarketMakerBinnedOrdersMetrics | null {
    return last(metrics.filter(isBinnedOrdersMetricsPresent)) || null;
  }

  orderPairByPriceAsset(
    {baseAsset, quoteAsset}: Private.AssetPair,
    isPriceAsset: (asset: Private.Asset) => boolean
  ): Private.AssetPair {
    const isBaseAssetPriceAsset = isPriceAsset(baseAsset);
    const isQuoteAssetPriceAsset = isPriceAsset(quoteAsset);

    if (!isBaseAssetPriceAsset && !isQuoteAssetPriceAsset)
      throw new Error('Invalid market pair, neither is price asset');
    else if (isBaseAssetPriceAsset && isQuoteAssetPriceAsset)
      throw new Error('Invalid market pair, both are price asset');
    else if (isBaseAssetPriceAsset)
      return {baseAsset: quoteAsset, quoteAsset: baseAsset};
    else if (isQuoteAssetPriceAsset) return {baseAsset, quoteAsset};

    throw new Error('Invalid market pair');
  }

  private produceInternalProfitabilityAccumulation(
    result: ProfitabilityAccumulationResult,
    value: Private.StitchedTimeseriesBinFillsData
  ): ProfitabilityAccumulationResult {
    /**
     * If we have data to perform accumulation on, we will do so, otherwise just return the empty bin.
     */
    if (!isStitchedBinFillsDataPresent(value)) {
      const emptyBin = {
        timestamp: value.timestamp,
      };

      return {
        ...result,
        accumulation: result.accumulation.concat(emptyBin),
      };
    }

    const {timestamp, ...stitchedBinFillsData} = value;
    const {externalMarketPrice} = stitchedBinFillsData;

    const {accumulativeAssetOneFeesAmount, accumulativeAssetTwoFeesAmount} =
      getAccumulativeAssetsFees(stitchedBinFillsData, result.previousWithData);

    const accumulativeFeesPriceAssetAmount =
      accumulativeAssetOneFeesAmount * externalMarketPrice +
      accumulativeAssetTwoFeesAmount;

    const {
      accumulativeAssetOneAmountNetPosition,
      accumulativeAssetTwoAmountNetPosition,
    } = getAccumulativeAssetsNetPositions(value, result.previousWithData);

    const accumulativeBoughtInPriceAssetAmount =
      getAccumulativeBoughtInPriceAssetAmount(value, result.previousWithData);

    const {
      accumulativeAssetOneAmountBought,
      accumulativeAssetTwoAmountBought,
      accumulativeAssetOneAmountSold,
      accumulativeAssetTwoAmountSold,
    } = getAccumulativeAssetsBoughtSold(value, result.previousWithData);

    const accumulativeFees = getAccumulativeFees(
      value,
      result.previousWithData
    );

    const accumulativeAssetsBoughtCount = getAccumulativeAssetsBoughtCount(
      value,
      result.previousWithData
    );

    const accumulativeAssetsSoldInPriceAssetAmount =
      accumulativeAssetOneAmountSold * externalMarketPrice +
      accumulativeAssetTwoAmountSold;

    const accumulativeAssetsBoughtInPriceAssetAmount =
      accumulativeAssetOneAmountBought * externalMarketPrice +
      accumulativeAssetTwoAmountBought;

    const accumulativeCostOfInvestmentInPriceAssetAmount =
      accumulativeAssetsSoldInPriceAssetAmount +
      accumulativeFeesPriceAssetAmount;

    const accumulativeValueOfInvestmentInPriceAssetAmount =
      accumulativeAssetsBoughtInPriceAssetAmount;

    const accumulativeEarnedInPriceAssetAmount =
      accumulativeValueOfInvestmentInPriceAssetAmount -
      accumulativeCostOfInvestmentInPriceAssetAmount;

    const roiPercent =
      accumulativeEarnedInPriceAssetAmount /
      accumulativeCostOfInvestmentInPriceAssetAmount;

    const newProfitabilityAccumulationData: Required<Private.InternalProfitabilityAccumulationData> =
      {
        timestamp,
        externalMarketPrice,
        ...getBinAssetsBoughtSold(value),
        earnedPriceAssetAmount: getBinEarnedPriceAssetAmount(value),
        accumulativeAssetOneAmountBought,
        accumulativeAssetTwoAmountBought,
        accumulativeAssetOneAmountSold,
        accumulativeAssetTwoAmountSold,
        accumulativeAssetOneAmountNetPosition,
        accumulativeAssetTwoAmountNetPosition,
        roiPercent,
        accumulativeBoughtInPriceAssetAmount,
        accumulativeEarnedInPriceAssetAmount,
        accumulativeAssetOneFeesAmount,
        accumulativeAssetTwoFeesAmount,
        ...accumulativeFees,
        ...accumulativeAssetsBoughtCount,
      };

    return {
      previousWithData: newProfitabilityAccumulationData,
      accumulation: result.accumulation.concat(
        newProfitabilityAccumulationData
      ),
    };
  }

  private internalToPublicData(
    internalData: Private.InternalProfitabilityAccumulationData
  ): Private.MarketMakerMetricsBinnedOrders['data'][0] {
    return {
      timestamp: internalData.timestamp,
      roiPercent: internalData.roiPercent,
      earnedPriceAssetAmount: internalData.accumulativeEarnedInPriceAssetAmount,
      externalMarketPrice: internalData.externalMarketPrice,
      accumulativeAssetOneAmountBought:
        internalData.accumulativeAssetOneAmountBought,
      accumulativeAssetTwoAmountBought:
        internalData.accumulativeAssetTwoAmountBought,
      accumulativeAssetOneAmountNetPosition:
        internalData.accumulativeAssetOneAmountNetPosition,
      accumulativeAssetTwoAmountNetPosition:
        internalData.accumulativeAssetTwoAmountNetPosition,
      accumulativeAssetOneBoughtCount:
        internalData.accumulativeAssetOneBoughtCount,
      accumulativeAssetTwoBoughtCount:
        internalData.accumulativeAssetTwoBoughtCount,
      accumulativeTotalOpenTransactionFeeAmount:
        internalData.accumulativeTotalOpenTransactionFeeAmount,
      accumulativeTotalCancelTransactionFeeAmount:
        internalData.accumulativeTotalCancelTransactionFeeAmount,
      accumulativeTotalBuyMakerFromAssetFeeAmount:
        internalData.accumulativeTotalBuyMakerFromAssetFeeAmount,
      accumulativeTotalSellMakerFromAssetFeeAmount:
        internalData.accumulativeTotalSellMakerFromAssetFeeAmount,
      accumulativeTotalMakerAdaFlatFeeAmount:
        internalData.accumulativeTotalMakerAdaFlatFeeAmount,
    };
  }

  produceProfitabilityAccumulationDatas(
    stitchedBinFillsDatas: Private.StitchedTimeseriesBinFillsData[]
  ): Private.MarketMakerMetricsBinnedOrders['data'] {
    return (
      stitchedBinFillsDatas
        /**
         * First we perform an internal accumulation on the stitched timesseries bin fills data.
         * Then we map it to a more concise format when we no longer need the excess accumulation data.
         */
        .reduce(this.produceInternalProfitabilityAccumulation, {
          accumulation: [],
          previousWithData: null,
        } as ProfitabilityAccumulationResult)
        .accumulation.map(this.internalToPublicData)
    );
  }
}
