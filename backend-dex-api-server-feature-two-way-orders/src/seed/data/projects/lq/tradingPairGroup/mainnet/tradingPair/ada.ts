import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {lqAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '72037453-b7dd-4a99-9cd6-24a26eda5f71',
  [lqAsset.assetId, adaAsset.assetId]
);
