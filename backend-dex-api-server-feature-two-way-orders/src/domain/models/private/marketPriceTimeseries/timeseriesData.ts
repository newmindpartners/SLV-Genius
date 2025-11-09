export type TimeseriesAggPriceData = {
  timestamp: number;
  price?: number;
};

export type BinFillsData<Numeric = number, Count = number> = {
  internalMarketPrice: number | null;

  totalBuyToAmountFilled: Numeric | null;
  totalBuyFromAmountFilled: Numeric | null;
  totalBuyCount: Count | null;
  totalSellToAmountFilled: Numeric | null;
  totalSellFromAmountFilled: Numeric | null;
  totalSellCount: Count | null;

  totalOpenTransactionFeeAmount: Numeric | null;
  totalCancelTransactionFeeAmount: Numeric | null;
  totalMakerAdaFlatFeeAmount: Numeric | null;
  totalBuyMakerFromAssetFeeAmount: Numeric | null;
  totalSellMakerFromAssetFeeAmount: Numeric | null;
};

export type TimeseriesBinFillsQueryResponse<
  Numeric = number,
  Count = number
> = {
  timestamp: Numeric;
} & BinFillsData<Numeric, Count>;

export type StitchedTimeseriesBinFillsData = {
  timestamp: number;
} & BinFillsData & {
    externalMarketPrice?: number;
  };
