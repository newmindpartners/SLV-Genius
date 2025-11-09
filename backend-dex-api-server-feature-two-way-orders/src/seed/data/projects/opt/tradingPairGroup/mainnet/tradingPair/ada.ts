import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {optAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'c50f5cc9-bfe9-402c-9c57-f0bc776a7519',
  [optAsset.assetId, adaAsset.assetId]
);
