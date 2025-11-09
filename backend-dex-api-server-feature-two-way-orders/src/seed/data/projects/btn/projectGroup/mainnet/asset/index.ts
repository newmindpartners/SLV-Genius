import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset1aysa4jzmlp6aym80knej09f64vcjy03dqmq23k';
const shortName = 'BTN';

export const btnAsset: Seed.Asset = {
  assetId,
  policyId: '016be5325fd988fea98ad422fcfd53e5352cacfced5c106a932a35a4',
  assetName: '42544e',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 6,

  webEnabled: true,
};

export const assets = {
  btn: btnAsset,
};
