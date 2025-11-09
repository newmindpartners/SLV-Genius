import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset100u769uhgqpt3te0qnetqd63k2zqqe5zptzcgt';
const shortName = 'USDM';

export const usdmAsset: Seed.Asset = {
  assetId,
  policyId: 'f03eca9ebdd30db76c5d5c0b450c97bbb4faccbc67cbf683e483197c',
  assetName: '745553444d',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  usdm: usdmAsset,
};
