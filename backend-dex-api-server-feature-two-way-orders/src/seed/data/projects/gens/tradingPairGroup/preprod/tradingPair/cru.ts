import {gensAssetPreprod} from '~/seed/data/projects/gens/projectGroup/preprod/asset';
import {cruAsset} from '~/seed/data/projects/cru/projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'adbab8d3-b5f5-435f-84ea-8afdf576c31e',
  [gensAssetPreprod.assetId, cruAsset.assetId]
);
