import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {hoskyAsset} from '../../../projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'c251becb-a9cb-47cb-98dd-2a1d07e5c922',
  [hoskyAsset.assetId, adaAsset.assetId]
);
