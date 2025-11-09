import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {cruAsset} from '~/seed/data/projects/cru/projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '1ba87808-78da-41c5-a7fc-cd0b8c5f1a95',
  [cruAsset.assetId, adaAsset.assetId]
);
