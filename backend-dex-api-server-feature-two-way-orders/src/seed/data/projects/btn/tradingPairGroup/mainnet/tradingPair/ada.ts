import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {btnAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '8fabbb1a-2a4e-4966-b7d0-d7a73f1b7d58',
  [btnAsset.assetId, adaAsset.assetId]
);
