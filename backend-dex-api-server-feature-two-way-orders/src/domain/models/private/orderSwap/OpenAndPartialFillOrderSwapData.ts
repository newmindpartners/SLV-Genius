import * as Private from '~/domain/models/private';

export type OrderSwapMakerFees = {
  makerLovelaceFlatFeeAmount: string;
  makerFromAssetFeeAmount: string;
  makerFromAssetFeePercent: string;
};

export type OrderSwapMakerFeesTransactionFee =
  // maker fees, transaction fee
  Private.OrderSwapMakerFees & Private.TransactionFee;

export type OrderSwapMakerFeesTransactionFeeAndDeposit =
  // maker fees, transaction fee, deposit
  Private.OrderSwapMakerFeesTransactionFee & Private.Deposit;

export type OrderSwapOpenAndPartialFillBase = {
  orderSwapId: string;

  userId: string | null;

  depositAmount: string;

  transactionFeeAmount: string;
  transactionTimestamp: number;

  orderType: 'LIMIT';

  toAssetId: string;
  fromAssetId: string;

  toAssetAmount: string;
  fromAssetAmount: string;

  effectiveFromDate: Date | null;
  effectiveUntilDate: Date | null;

  toAssetAmountTotalFilled: string;
  fromAssetAmountTotalFilled: string;

  toAssetAmountTotalRemaining: string;
  fromAssetAmountTotalRemaining: string;

  price: number;
  priceNumerator: string | null;
  priceDenominator: string | null;

  utxoReferenceTransactionHash: string;
  utxoReferenceIndex: number;

  mintAssetId: string;

  partialFillCount: number;

  makerLovelaceFlatFeeAmount: string;
  makerFromAssetFeeAmount: string;
  makerFromAssetFeePercent: string;

  takerLovelaceFlatFeeAmount: string;
};

export type OrderSwapFillBase = {
  takerFromAssetFeeAmount: string;
  takerFromAssetFeePercent: string;

  filledOrderSwapUnspentOutputReferenceWithAmounts: Array<{
    filledOrderSwapUnspentOutputReference: {
      filledOrderSwapUtxoReferenceIndex: number;
      filledOrderSwapUtxoReferenceTransactionHash: string;
    };
    filledOrderSwapToAssetFillAmount: string;
  }>;

  orderType: 'FILL_DIRECT' | 'FILL_BEST_AVAILABLE';
};

// <!-- Fill Order, Consuming, Taker --!> //

export type OrderSwapTakerFees = {
  takerLovelaceFlatFeeAmount: string;
  takerFromAssetFeeAmount: string;
  takerFromAssetFeePercent: string;
};

export type OrderSwapTakerFeesTransactionFee =
  // taker fees, transaction fee, but not deposit
  Private.OrderSwapTakerFees & Private.TransactionFee;
