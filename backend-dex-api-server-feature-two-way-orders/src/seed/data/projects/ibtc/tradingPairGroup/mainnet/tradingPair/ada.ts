import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {ibtcAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '6673a4df-c053-427a-bf74-603275207bd6',
  [ibtcAsset.assetId, adaAsset.assetId]
);
