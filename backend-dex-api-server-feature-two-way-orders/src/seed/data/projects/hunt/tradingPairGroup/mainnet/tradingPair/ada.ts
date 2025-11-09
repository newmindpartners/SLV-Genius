import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {huntAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'f659142b-c773-48ef-b73e-e444250c6666',
  [huntAsset.assetId, adaAsset.assetId]
);
