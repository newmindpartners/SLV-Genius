import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {nmkrAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '7582da8b-1b6e-459b-8a7c-cf5e4d382286',
  [nmkrAsset.assetId, adaAsset.assetId]
);
