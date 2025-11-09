import {gensxAsset} from '../../../projectGroup/mainnet';
import {djedAsset} from '~/seed/data/projects/djed/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '3c867094-ed0c-4fd9-b409-72dbbffeb3ec',
  [gensxAsset.assetId, djedAsset.assetId]
);
