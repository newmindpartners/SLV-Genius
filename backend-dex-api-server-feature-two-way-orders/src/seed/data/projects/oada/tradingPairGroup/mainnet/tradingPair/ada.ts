import {oadaAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'a67088d2-25ee-48ea-8438-90db381ff988',
  [oadaAsset.assetId, adaAsset.assetId]
);
