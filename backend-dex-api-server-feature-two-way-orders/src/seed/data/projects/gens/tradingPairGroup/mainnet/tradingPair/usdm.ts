import {gensAsset} from '../../../projectGroup/mainnet';
import {usdmAsset} from '~/seed/data/projects/usdm/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'e76d799c-6b7a-4161-836b-4f040d8e2a1e',
  [gensAsset.assetId, usdmAsset.assetId]
);
