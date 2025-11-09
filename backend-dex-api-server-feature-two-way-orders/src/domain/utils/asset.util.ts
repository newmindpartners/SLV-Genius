import blake2b from 'blake2b';

import {bech32} from 'bech32';

import {div} from './math.util';

import * as Private from '~/domain/models/private';

import {fromHex, toHex} from '@aws-sdk/util-hex-encoding';
import {includes} from 'lodash';

export function assetName(shortName: string): string {
  return toHex(Buffer.from(shortName)).toString();
}

export function shortName(assetName: string): string {
  return Buffer.from(fromHex(assetName)).toString();
}

export function isAdaAssetId(anAssetId: string): boolean {
  return assetId('', '') === anAssetId;
}

export const isAda = (asset: Private.Asset) =>
  asset.assetId === 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj';

/**
 * CIP 14 - User-Facing Asset Fingerprint
 * https://cips.cardano.org/cips/cip14
 * https://github.com/Emurgo/cip14-js
 *
 * assetFingerprint := encodeBech32
 *       ( datapart = hash
 *         ( algorithm = 'blake2b'
 *         , digest-length = 20
 *         , message = policyId | assetName
 *         )
 *       , humanReadablePart = 'asset'
 *       )
 */
export function assetId(policyId: string, assetName: string): string {
  const policyIdBuffer = Buffer.from(policyId, 'hex');
  const assetNameBuffer = Buffer.from(assetName, 'hex');
  const policyIdAssetNameBuffer = new Uint8Array([
    ...policyIdBuffer,
    ...assetNameBuffer,
  ]);

  return bech32.encode(
    'asset',
    bech32.toWords(blake2b(20).update(policyIdAssetNameBuffer).digest('binary'))
  );
}

export function fullHexAssetIdToPartialBech32AssetId(
  fullAssetId: string
): string {
  const valueBuffer = Buffer.from(fullAssetId, 'hex');
  const policyIdAssetNameBuffer = new Uint8Array(valueBuffer);
  return bech32.encode(
    'asset',
    bech32.toWords(blake2b(20).update(policyIdAssetNameBuffer).digest('binary'))
  );
}

export const isAssetIdBech32 = (assetId: string): boolean =>
  includes(assetId, 'asset');

export const calcUnitMultiplier = (decimalPrecision: number) =>
  Math.pow(10, decimalPrecision);

export const calcPrice = (
  quoteAssetAmountPrice: string,
  baseAssetAmountPrice: string
): string => div(quoteAssetAmountPrice, baseAssetAmountPrice).toString();
