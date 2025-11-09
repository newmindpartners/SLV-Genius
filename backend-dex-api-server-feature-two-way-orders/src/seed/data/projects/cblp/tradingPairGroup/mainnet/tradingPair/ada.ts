import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {cblpAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '62d8a13f-39db-4ac1-b9a9-69484857bb91',
  [cblpAsset.assetId, adaAsset.assetId]
);
