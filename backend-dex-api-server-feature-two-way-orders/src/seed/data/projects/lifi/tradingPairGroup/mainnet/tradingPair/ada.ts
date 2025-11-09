import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {lifiAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '1f5b89f3-a2e4-4bf0-8c9a-432368a9fa65',
  [lifiAsset.assetId, adaAsset.assetId]
);
