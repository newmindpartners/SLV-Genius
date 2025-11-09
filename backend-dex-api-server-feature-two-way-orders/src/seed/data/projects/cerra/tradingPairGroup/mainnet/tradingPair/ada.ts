import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {cerraAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '5bba1575-5cce-4497-bee9-5a9df36a8d13',
  [cerraAsset.assetId, adaAsset.assetId]
);
