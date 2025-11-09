import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {clayAsset} from '../../../projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'bca4af36-9020-41ca-aa7d-08dba23bccef',
  [clayAsset.assetId, adaAsset.assetId]
);
