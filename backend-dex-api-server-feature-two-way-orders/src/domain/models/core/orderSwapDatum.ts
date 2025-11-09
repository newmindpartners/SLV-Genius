import {Datum} from './datum';
import {DatumTypes} from './datumType';

import {Hex, Rational} from '~/domain/models/cardano';

import * as Core from '~/domain/models/core';
import * as Oura from '~/domain/models/oura';
import {isNull} from 'lodash';
import {stringOrNull} from '~/domain/utils/string.util';
import {clampBigInt} from '~/domain/utils/math.util';

const hexStringToBigInt = (hex: string) => BigInt('0x' + hex);

const maxDate = 8640000000000000n;
const minDate = -8640000000000000n;

export type IntEnvelope = {
  int?: number;
};
export type BigUIntEnvelope = {
  biguint?: string;
};
export type BigNIntEnvelope = {
  bignint?: string;
};

type IntLikeEnvelope = IntEnvelope & BigUIntEnvelope & BigNIntEnvelope;

export const getBigIntValue = (envelope: IntLikeEnvelope) => {
  if (envelope?.int || envelope?.int === 0) {
    return BigInt(envelope.int);
  }
  if (envelope?.biguint) {
    return hexStringToBigInt(envelope.biguint);
  }
  if (envelope?.bignint) {
    return hexStringToBigInt(envelope.bignint);
  }
  return false;
};

export const bigIntOrNull = (envelope: IntLikeEnvelope) => {
  const value = getBigIntValue(envelope);
  return !!value || value === 0n ? value : null;
};

export const numberOrNull = (envelope: IntLikeEnvelope) => {
  const value = getBigIntValue(envelope);
  return !!value || value === 0n ? Number(value) : null;
};

export const dateOrNull = (envelope: IntLikeEnvelope) => {
  const value = getBigIntValue(envelope);
  return !!value || value === 0n
    ? new Date(Number(clampBigInt(value, minDate, maxDate)))
    : null;
};

const OrderSwapDatumType = DatumTypes.ORDER_SWAP_DATUM;

export type OrderSwapDatum = Datum & {
  ownerPublicKeyHash: Hex; // 0 podOwnerKey

  ownerPaymentKeyHash: Hex; // 1 podOwnerAddr
  walletStakeKeyHash: Hex | null; // 1 podOwnerAddr

  baseAssetPolicyId: Hex; // 2 podOfferedAsset
  baseAssetAssetName: Hex; // 2 podOfferedAsset

  quoteAssetOriginalAmount: bigint; // 3 podOfferedOriginalAmount
  quoteAssetAmount: bigint; // 4 podOfferedAmount
  quoteAssetPolicyId: Hex; // 5 podAskedAsset
  quoteAssetAssetName: Hex; // 5 podAskedAsset
  quoteBaseAssetRatio: Rational; // 6 podPrice

  mintAssetName: Hex; // 7 podNFT

  effectiveFromDate: Date | null; // 8 podStart
  effectiveUntilDate: Date | null; // 9 podEnd

  partialFillsCount: number; // 10 podPartialFills

  makerLovelaceFlatFeeAmount: number; // 11 podMakerLovelaceFlatFee
  takerLovelaceFlatFeeAmount: number; // 12 podTakerFee

  makerQuoteAssetFeeAmount: number; // 13 podContainedFee pocfOfferedTokens
};

export function makeOrderSwapDatum(
  payload: Omit<OrderSwapDatum, 'datumType'>
): OrderSwapDatum {
  return {
    datumType: OrderSwapDatumType,
    ...payload,
  };
}

export function isOrderSwapDatum(
  datum: OrderSwapDatum
): datum is OrderSwapDatum {
  return datum && OrderSwapDatumType === datum.datumType;
}

export function findOrderSwapDatum(
  datum: OrderSwapDatum[]
): OrderSwapDatum | null {
  for (const it of datum) {
    if (isOrderSwapDatum(it)) {
      return it;
    }
  }
  return null;
}

/**
 * https://github.com/geniusyield/Core/blob/7b07ece41518348c8b7190fa7c3630da088344b0/geniusyield-onchain/geniusyield-common/src/GeniusYield/OnChain/Common/DEX/PartialOrder.hs
 *
 *  0 podOwnerKey              :: PubKeyHash                -- ^ Public key hash of the owner. Order cancellations must be signed by this.
 *  1 podOwnerAddr             :: Address                   -- ^ Address of the owner. Payments must be made to this address.
 *  2 podOfferedAsset          :: AssetClass                -- ^ The asset being offered.
 *  3 podOfferedOriginalAmount :: Integer                   -- ^ Original number of units being offered. Initially, this would be same as `podOfferedAmount`.
 *  4 podOfferedAmount         :: Integer                   -- ^ The number of units being offered.
 *  5 podAskedAsset            :: AssetClass                -- ^ The asset being asked for as payment.
 *  6 podPrice                 :: PlutusTx.Rational         -- ^ The price for one unit of the offered asset.
 *  7 podNFT                   :: TokenName                 -- ^ Token name of the NFT identifying this order.
 *  8 podStart                 :: Maybe POSIXTime           -- ^ The time when the order can earliest be filled (optional).
 *  9 podEnd                   :: Maybe POSIXTime           -- ^ The time when the order can latest be filled (optional).
 * 10 podPartialFills          :: Integer                   -- ^ Number of partial fills order has undergone, initially would be 0., podMakerLovelaceFlatFee   :: Integer                   -- ^ Flat fee (in lovelace) paid by the maker.
 * 11 podMakerLovelaceFlatFee  :: Integer                   -- ^ Flat fee (in lovelace) paid by the maker.
 * 12 podTakerLovelaceFlatFee  :: Integer                   -- ^ Flat fee (in lovelace) paid by the taker.
 * 13 podContainedFee          :: PartialOrderContainedFee  -- ^ Fee as lovelace contained in the order.
 *    pocfFlatLovelaces        :: Integer                   -- ^ Flat lovelace fee contained in the order.
 *    pocfOfferedTokens        :: Integer                   -- ^ Fee collected as percentage of offered tokens from maker.
 *    pocfAskedTokens          :: Integer                   -- ^ Fee collected as percentage of asked tokens from taker.
 * 14 podContainedPayment      :: Integer                   -- ^ Payment (in asked asset) contained in the order.
 **/
const datumFieldIndexMap = {
  podOwnerKey: 0,
  podOwnerAddr: 1,
  podOfferedAsset: 2,
  podOfferedOriginalAmount: 3,
  podOfferedAmount: 4,
  podAskedAsset: 5,
  podPrice: 6,
  podNFT: 7,
  podStart: 8,
  podEnd: 9,
  podPartialFills: 10,
  podMakerLovelaceFlatFee: 11,
  podTakerLovelaceFlatFee: 12,
  podContainedFee: 13,
  podContainedPayment: 14,
};

export function mapOrderSwapDatum(
  it: Oura.PlutusData
): Core.OrderSwapDatum | null {
  const {datum_hash: datumHash, plutus_data} = it;

  if (
    datumHash &&
    plutus_data &&
    plutus_data.fields &&
    plutus_data.fields.length === 15
  ) {
    // 0 podOwnerKey public key hash
    const ownerPublicKeyHash: Hex | null =
      plutus_data?.fields?.[datumFieldIndexMap.podOwnerKey]?.bytes || null;

    // 1 podOwnerAddr payment key
    const ownerPaymentKeyHash: Hex | null =
      plutus_data?.fields?.[datumFieldIndexMap.podOwnerAddr]?.fields?.[0]
        ?.fields?.[0]?.bytes || null;

    // 1 podOwnerAddr staking key (optional)
    const walletStakeKeyHash: Hex | null =
      plutus_data?.fields?.[datumFieldIndexMap.podOwnerAddr]?.fields?.[1]
        ?.fields?.[0]?.fields?.[0]?.fields?.[0]?.bytes || null;

    // 2 podOfferedAsset
    const quoteAssetPolicyId: Hex | null = stringOrNull(
      plutus_data?.fields?.[datumFieldIndexMap.podOfferedAsset]?.fields?.[0]
        ?.bytes
    );
    const quoteAssetAssetName: Hex | null = stringOrNull(
      plutus_data?.fields?.[datumFieldIndexMap.podOfferedAsset]?.fields?.[1]
        ?.bytes
    );

    // 3 podOfferedOriginalAmount
    const quoteAssetOriginalAmount: bigint | null = bigIntOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podOfferedOriginalAmount] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );

    // 4 podOfferedAmount
    const quoteAssetAmount: bigint | null = bigIntOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podOfferedAmount] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );

    // 5 podAskedAsset
    const baseAssetPolicyId: Hex | null = stringOrNull(
      plutus_data?.fields?.[datumFieldIndexMap.podAskedAsset]?.fields?.[0]
        ?.bytes
    );
    const baseAssetAssetName: Hex | null = stringOrNull(
      plutus_data?.fields?.[datumFieldIndexMap.podAskedAsset]?.fields?.[1]
        ?.bytes
    );

    // 6 podPrice
    const numerator: bigint | null = bigIntOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podPrice]?.fields?.[0] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );
    const denominator: bigint | null = bigIntOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podPrice]?.fields?.[1] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );
    const quoteBaseAssetRatio: Rational | null =
      (numerator &&
        denominator && {
          numerator,
          denominator,
        }) ||
      null;

    // 7 podNft
    const mintAssetName: Hex | null =
      plutus_data?.fields?.[datumFieldIndexMap.podNFT]?.bytes || null;

    // 8 podStart (optional)
    const effectiveFromDate: Date | null = dateOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podStart]?.fields?.[0] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );

    // 9 podEnd (optional)
    const effectiveUntilDate: Date | null = dateOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podEnd]?.fields?.[0] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );

    // 10 podPartialFills
    const partialFillsCount: number | null = numberOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podPartialFills] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );

    // 11 podMakerLovelaceFlatFee
    const makerLovelaceFlatFeeAmount: number | null = numberOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podMakerLovelaceFlatFee] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );

    // 12 podTakerFee
    const takerLovelaceFlatFeeAmount: number | null = numberOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podTakerLovelaceFlatFee] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );

    // 13 podContainedFee pocfOfferedTokens
    const makerQuoteAssetFeeAmount: number | null = numberOrNull(
      (plutus_data?.fields?.[datumFieldIndexMap.podContainedFee]?.fields?.[1] ??
        ({} as unknown as IntLikeEnvelope)) as IntLikeEnvelope
    );

    if (
      ownerPublicKeyHash &&
      ownerPaymentKeyHash &&
      !isNull(quoteAssetPolicyId) &&
      !isNull(quoteAssetAssetName) &&
      quoteAssetOriginalAmount &&
      quoteAssetAmount &&
      !isNull(baseAssetPolicyId) &&
      !isNull(baseAssetAssetName) &&
      quoteBaseAssetRatio &&
      mintAssetName &&
      !isNull(partialFillsCount) &&
      !isNull(makerLovelaceFlatFeeAmount) &&
      !isNull(makerQuoteAssetFeeAmount) &&
      !isNull(takerLovelaceFlatFeeAmount)
    ) {
      return Core.makeOrderSwapDatum({
        datumHash,

        ownerPublicKeyHash,

        ownerPaymentKeyHash,
        walletStakeKeyHash, // (optional)

        quoteAssetPolicyId,
        quoteAssetAssetName,
        quoteAssetOriginalAmount,
        quoteAssetAmount,

        baseAssetPolicyId,
        baseAssetAssetName,

        quoteBaseAssetRatio,

        mintAssetName,

        effectiveFromDate, // (optional)
        effectiveUntilDate, // (optional)

        partialFillsCount,

        makerLovelaceFlatFeeAmount,
        takerLovelaceFlatFeeAmount,
        makerQuoteAssetFeeAmount,
      });
    }
  }

  return null;
}
