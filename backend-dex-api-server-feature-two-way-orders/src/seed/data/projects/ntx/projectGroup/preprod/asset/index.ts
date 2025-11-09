import {assetId} from '~/domain/utils/asset.util';
import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const tNtxData = {
  shortName: 'NTX',
  assetName: '744e5458',
  policyId: '84be37380867957f86042ab6e2d5e862c94d31af1f4438a437f61950',
};

const tNtxAsset: Seed.Asset = {
  assetId: assetId(tNtxData.policyId, tNtxData.assetName),
  policyId: tNtxData.policyId,
  assetName: tNtxData.assetName,

  shortName: tNtxData.shortName,
  iconUrl: getAssetIconUrl(tNtxData.shortName),
  longName: 'NuNet',

  decimalPrecision: 6,
};

const mNtxData = {
  shortName: 'mNTX',
  assetName: '6d4e5458',
  policyId: '8cafc9b387c9f6519cacdce48a8448c062670c810d8da4b232e56313',
};

const mNtxAsset: Seed.Asset = {
  assetId: assetId(mNtxData.policyId, mNtxData.assetName),
  policyId: mNtxData.policyId,
  assetName: mNtxData.assetName,

  shortName: mNtxData.shortName,
  iconUrl: getAssetIconUrl(mNtxData.shortName),
  longName: 'NuNet',

  decimalPrecision: 0,
};

export const assets = {
  tNtx: tNtxAsset,
  mNtx: mNtxAsset,
};
