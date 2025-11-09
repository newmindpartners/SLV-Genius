import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {sundaeAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '069f3382-bb51-47ae-a356-53a6436fa8b8',
  [sundaeAsset.assetId, adaAsset.assetId]
);
