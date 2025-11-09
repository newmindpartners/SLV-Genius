import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {indyAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'eb309ccb-fa1c-4382-9b12-f446e2555cd7',
  [indyAsset.assetId, adaAsset.assetId]
);
