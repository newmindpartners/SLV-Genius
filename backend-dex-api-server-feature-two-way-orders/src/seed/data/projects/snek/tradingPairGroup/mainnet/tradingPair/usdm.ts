import {snekAsset} from '../../../projectGroup/mainnet/asset';
import {usdmAsset} from '~/seed/data/projects/usdm/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '64e7cebf-c70c-4710-9804-a2f781fc1433',
  [snekAsset.assetId, usdmAsset.assetId]
);
