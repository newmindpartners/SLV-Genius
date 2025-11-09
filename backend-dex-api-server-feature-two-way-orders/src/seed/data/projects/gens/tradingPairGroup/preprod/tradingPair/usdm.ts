import {gensAssetPreprod} from '~/seed/data/projects/gens/projectGroup/preprod/asset';
import {usdmAsset} from '~/seed/data/projects/usdm/projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '334b7716-193a-4523-b933-38e01abaa18d',
  [gensAssetPreprod.assetId, usdmAsset.assetId]
);
