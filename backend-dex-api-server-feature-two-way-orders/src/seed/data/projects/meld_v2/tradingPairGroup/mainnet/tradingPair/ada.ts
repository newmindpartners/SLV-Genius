import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';
import {meldNewAsset} from '../../../projectGroup/mainnet/asset';

export const tradingPair = createTradingPair(
  '82175a19-2351-4f64-8331-3d14d7d3446b',
  [meldNewAsset.assetId, adaAsset.assetId]
);
