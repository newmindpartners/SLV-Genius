import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {paviaAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'd1fb7464-e107-4390-af1e-c4023f4d1819',
  [paviaAsset.assetId, adaAsset.assetId]
);
