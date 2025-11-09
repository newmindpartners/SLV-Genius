import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {omniAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'c385edc3-2d13-4cce-b6f5-f6aacf9ebb96',
  [omniAsset.assetId, adaAsset.assetId]
);
