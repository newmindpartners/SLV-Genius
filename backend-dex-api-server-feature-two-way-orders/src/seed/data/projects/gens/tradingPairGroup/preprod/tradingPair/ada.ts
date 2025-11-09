import {gensAssetPreprod} from '~/seed/data/projects/gens/projectGroup/preprod/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'da07cc19-438e-439e-b6a2-d1fd1eae76ef',
  [gensAssetPreprod.assetId, adaAsset.assetId]
);
