import {getAssetIconUrl} from '~/domain/utils/url.util';
import * as Seed from '~/seed/types';

const assetId = 'asset16xtxrn9ql9ttxq2l72vdq8nhtgg3yja8798ymz';
const shortName = 'rsBTC';

export const rsbtcAsset: Seed.Asset = {
  assetId,
  policyId: '2dbc49f682ad21f6d18705cf446f9f7a277731ab70ae21a454f888b2',
  assetName: '7273425443',

  shortName,
  iconUrl: getAssetIconUrl(assetId),
  longName: shortName,

  decimalPrecision: 8,

  webEnabled: true,
};

export const assets = {
  rsbtc: rsbtcAsset,
};
