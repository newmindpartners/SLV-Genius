import {AbstractRequest} from './abstract';

import {UnspentTransactionOutputRequest} from '~/domain/models/core/abstract';

type BaseQuoteAssetAmount = 'baseAssetAmount' | 'quoteAssetAmount';

type OrderBaseQuoteAssetIdNamePolicyId = Pick<
  OrderBaseAsset,
  BaseAssetIdNamePolicyId
> &
  Pick<OrderQuoteAsset, QuoteAssetIdNamePolicyId>;

type OrderBaseQuoteAssetAmount = OrderBaseAssetAmount & OrderQuoteAssetAmount;

type OrderRequest = AbstractRequest;

type OrderBaseAsset = {
  baseAssetId: string;
  baseAssetName: string;
  baseAssetPolicyId: string;
};

type OrderQuoteAssetAmount = {
  quoteAssetAmount: string;
};

type OrderBaseAssetAmount = {
  baseAssetAmount: string;
};

type BaseAssetIdNamePolicyId =
  | 'baseAssetId'
  | 'baseAssetName'
  | 'baseAssetPolicyId';

type QuoteAssetIdNamePolicyId =
  | 'quoteAssetId'
  | 'quoteAssetName'
  | 'quoteAssetPolicyId';

type OrderQuoteAsset = {
  quoteAssetId: string;
  quoteAssetName: string;
  quoteAssetPolicyId: string;
};

export type OrderSaleRequestTemplate = OrderBaseQuoteAssetIdNamePolicyId & {
  feeAddress: string;
  feePercent: string;

  endDate: string;
  startDate: string;
  distributionDate: string;

  sellerPublicKeyHash: string;

  orderBaseAssetMinAllocation: number;
};

export type OrderSaleRequest = OrderRequest & OrderSaleRequestTemplate;

export type OrderSaleOpenRequest = OrderSaleRequest &
  Pick<OrderBaseQuoteAssetAmount, BaseQuoteAssetAmount>;

export type OrderSaleCancelRequest = OrderRequest &
  OrderSaleRequest &
  OrderSaleOpenRequest &
  UnspentTransactionOutputRequest;

export type OrderSaleGetScriptAddressRequest = OrderSaleRequestTemplate &
  Pick<OrderSaleOpenRequest, 'quoteAssetAmount'>;
