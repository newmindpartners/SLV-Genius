import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {kitupAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'c6f161b7-2f83-4b1d-8d21-d94bdb61ae7f',
  [kitupAsset.assetId, adaAsset.assetId]
);
