import {gensAsset} from '../../../projectGroup/mainnet';
import {iusdAsset} from '~/seed/data/projects/iusd/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '2520e237-f827-409e-a9ca-379651b0f857',
  [gensAsset.assetId, iusdAsset.assetId]
);
