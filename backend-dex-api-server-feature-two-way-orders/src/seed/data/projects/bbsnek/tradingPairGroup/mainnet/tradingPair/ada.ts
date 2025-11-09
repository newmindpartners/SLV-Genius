import {bbsnekAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '3ed3ee44-05d6-4f9f-a021-648883ae980c',
  [bbsnekAsset.assetId, adaAsset.assetId]
);
