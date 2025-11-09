import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset15mrtrz2c78fuccy85syzzpq2q7w766nyaw5a0d';
const shortName = 'MELD';

export const meldNewAsset: Seed.Asset = {
  assetId,
  policyId: 'a2944573e99d2ed3055b808eaa264f0bf119e01fc6b18863067c63e4',
  assetName: '4d454c44',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: 'MELD',

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  meldNew: meldNewAsset,
};
