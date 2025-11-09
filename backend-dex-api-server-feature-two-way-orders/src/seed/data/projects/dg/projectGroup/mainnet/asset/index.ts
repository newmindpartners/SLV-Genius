import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1gr47aq85qs4cj3z8ladfr4mguqnwxs2thzyghz';
const shortName = 'DG';

export const dgAsset: Seed.Asset = {
  assetId,
  policyId: 'f5f8e854af532d828d00381df799ba6db22d825c9b140e1d5795cf85',
  assetName: '0014df10447261676f6e476f6c64',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  dg: dgAsset,
};
