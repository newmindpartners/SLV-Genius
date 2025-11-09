import {djedAsset} from '../../../projectGroup/mainnet/asset';
import {iusdAsset} from '~/seed/data/projects/iusd/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '31af3a8d-dbbf-4f59-8c9c-966fde2e2dd8',
  [djedAsset.assetId, iusdAsset.assetId]
);
