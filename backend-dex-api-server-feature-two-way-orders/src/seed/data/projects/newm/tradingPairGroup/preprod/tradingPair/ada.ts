import {adaAsset} from '~/seed/data/commonGroup/preprod';
import {newmAsset} from '~/seed/data/projects/newm/projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'ffe69fc4-5d3b-40e3-9579-432cbe5cffc7',
  [newmAsset.assetId, adaAsset.assetId]
);
