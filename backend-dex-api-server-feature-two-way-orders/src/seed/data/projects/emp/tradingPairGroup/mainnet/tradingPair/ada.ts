import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {assets} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '2a335722-a83a-4722-9b6b-f95ef3521f7f',
  [assets.emp.assetId, adaAsset.assetId]
);
