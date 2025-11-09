import {usdmAsset} from '../../../projectGroup/mainnet/asset';
import {djedAsset} from '~/seed/data/projects/djed/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'fd8bfdff-8c94-4c74-92aa-335e78407a57',
  [usdmAsset.assetId, djedAsset.assetId]
);
