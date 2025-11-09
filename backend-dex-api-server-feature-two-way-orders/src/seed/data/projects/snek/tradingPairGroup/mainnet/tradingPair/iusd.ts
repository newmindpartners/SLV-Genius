import {snekAsset} from '../../../projectGroup/mainnet/asset';
import {iusdAsset} from '~/seed/data/projects/iusd/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '4eccdd0b-88a5-4454-a81b-2479f97548a5',
  [snekAsset.assetId, iusdAsset.assetId]
);
