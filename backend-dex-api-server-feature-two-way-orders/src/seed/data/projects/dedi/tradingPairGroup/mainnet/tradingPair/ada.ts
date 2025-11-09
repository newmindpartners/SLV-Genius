import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {dediAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '587827e3-f79b-43ca-a916-86e9ecc35972',
  [dediAsset.assetId, adaAsset.assetId]
);
