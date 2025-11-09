import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {iethAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'a17e6a1d-0f2c-4f70-9ad1-0946d43854e0',
  [iethAsset.assetId, adaAsset.assetId]
);
