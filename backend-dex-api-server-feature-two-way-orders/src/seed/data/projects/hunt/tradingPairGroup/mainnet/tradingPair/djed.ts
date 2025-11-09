import {huntAsset} from '../../../projectGroup/mainnet/asset';
import {djedAsset} from '~/seed/data/projects/djed/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '9f855477-6a14-4cd1-ae56-88ad902ada80',
  [huntAsset.assetId, djedAsset.assetId]
);
