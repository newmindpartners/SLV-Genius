import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {copiAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'bbbbe0ed-3072-4e3b-aec1-e6a23f796fa9',
  [copiAsset.assetId, adaAsset.assetId]
);
