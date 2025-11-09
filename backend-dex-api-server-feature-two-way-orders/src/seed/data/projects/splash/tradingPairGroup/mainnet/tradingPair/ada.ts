import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {splashAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'b591e07c-5d1b-4629-9a60-06a8e2a90805',
  [splashAsset.assetId, adaAsset.assetId]
);
