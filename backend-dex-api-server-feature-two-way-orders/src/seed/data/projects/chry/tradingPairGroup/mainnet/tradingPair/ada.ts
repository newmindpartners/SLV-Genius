import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {chryAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '3ec91ec1-4854-4cb6-b8f6-2fa1d87149cb',
  [chryAsset.assetId, adaAsset.assetId]
);
