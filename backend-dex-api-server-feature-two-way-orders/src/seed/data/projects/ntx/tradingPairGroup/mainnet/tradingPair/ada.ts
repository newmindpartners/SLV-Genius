import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {assets} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '4fe56e4c-c11c-4e12-acd3-636692bc2476',
  [assets.ntx.assetId, adaAsset.assetId]
);
