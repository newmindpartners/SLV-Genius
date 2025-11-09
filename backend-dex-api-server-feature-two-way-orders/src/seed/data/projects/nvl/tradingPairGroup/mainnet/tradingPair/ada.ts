import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {nvlAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'afd8d20c-1bd5-4d75-bde2-0eb53a6f80ef',
  [nvlAsset.assetId, adaAsset.assetId]
);
