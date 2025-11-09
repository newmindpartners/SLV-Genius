import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1ggrdc8mffjm82xeu0zqlxgfe0kt22sptms3dsm';
const shortName = 'DANZO';

export const danzoAsset: Seed.Asset = {
  assetId,
  policyId: 'bf3e19192da77dfadc7c9065944e50ca7e1a439d90833e3ae58b720a',
  assetName: '44414e5a4f',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  danzo: danzoAsset,
};
