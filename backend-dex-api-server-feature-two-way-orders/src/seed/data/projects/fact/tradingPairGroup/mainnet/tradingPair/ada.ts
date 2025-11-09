import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {factAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '2c9f2437-824a-4a78-a2e7-640b96da9e82',
  [factAsset.assetId, adaAsset.assetId]
);
