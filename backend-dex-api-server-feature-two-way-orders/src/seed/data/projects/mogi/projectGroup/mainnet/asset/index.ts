import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1hptf452370q5ytep58v780rhx44haeujhrku6v';
const shortName = 'MOGI';

export const mogiAsset: Seed.Asset = {
  assetId,
  policyId: '6a0f6c32b77596240ff8bc78e1c334fa9bd2131750f47f3afb36b1b2',
  assetName: '4d4f4749',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 0,

  webEnabled: true,
};

export const assets = {
  mogi: mogiAsset,
};
