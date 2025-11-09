import {danzoAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'c3dd08b3-bfc5-4af6-be12-b847bf646cf0',
  [danzoAsset.assetId, adaAsset.assetId]
);
