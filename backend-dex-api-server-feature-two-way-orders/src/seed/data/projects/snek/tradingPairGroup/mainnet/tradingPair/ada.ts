import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {snekAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'ee896e88-2188-4c65-8415-fd06509ec87f',
  [snekAsset.assetId, adaAsset.assetId]
);
