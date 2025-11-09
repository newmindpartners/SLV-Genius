import * as CML from '@dcspark/cardano-multiplatform-lib-browser';
import { Buffer } from 'buffer';
import { CBOR } from '~/types/wallet';
import { WalletBalanceRecord } from '~/utils/wallet';

export const parseWalletBalanceCborToRecord = (
  walletBalance: CBOR,
): WalletBalanceRecord => {
  const buffer = Buffer.from(walletBalance, 'hex');
  const value = CML.Value.from_bytes(buffer);
  const multiAsset = value?.multiasset();
  const assetsRaw = multiAsset?.to_js_value();

  const assets: WalletBalanceRecord = {};

  for (const [policyId, assetsMap] of Object.entries(assetsRaw || {})) {
    for (const [assetName, balance] of Object.entries(assetsMap)) {
      const encodedAssetName = `${policyId}.${assetName}`;
      assets[encodedAssetName] = balance;
    }
  }

  return assets;
};
