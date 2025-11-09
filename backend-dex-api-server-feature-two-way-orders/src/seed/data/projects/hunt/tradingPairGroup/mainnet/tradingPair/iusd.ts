import {huntAsset} from '../../../projectGroup/mainnet/asset';
import {iusdAsset} from '~/seed/data/projects/iusd/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '7343750f-5a5d-4743-9808-0298810c9548',
  [huntAsset.assetId, iusdAsset.assetId]
);
