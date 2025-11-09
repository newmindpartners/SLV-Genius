import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {agixAsset} from '../../../projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'e5f580a2-d009-493f-b686-105fc2d53c4d',
  [agixAsset.assetId, adaAsset.assetId]
);
