import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1ayz4krx68d340j8gytsqnj7gn20pnxlla9uzfk';
const shortName = 'OMNI';

export const omniAsset: Seed.Asset = {
  assetId,
  policyId: '48f69a80dcca7bee58431b8b749faca98700ca456056d153fbea4eb2',
  assetName: '4f4d4e49',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 8,

  webEnabled: true,
};

export const assets = {
  omni: omniAsset,
};
