import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {assets} from '../../../projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'e3fcd185-1182-4b90-b425-cee5604d0403',
  [assets.emp.assetId, adaAsset.assetId]
);
