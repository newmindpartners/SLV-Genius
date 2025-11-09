import {shardsAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'd7b25e11-97d0-46d4-9b49-61ffde464f74',
  [shardsAsset.assetId, adaAsset.assetId]
);
