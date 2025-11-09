import {snekAsset} from '../../../projectGroup/mainnet/asset';
import {djedAsset} from '~/seed/data/projects/djed/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '997b689c-32a0-42e6-bd2a-3a090b43c400',
  [snekAsset.assetId, djedAsset.assetId]
);
