import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {jellyAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '952b3f18-71a9-42d2-9882-d224d1c97fcb',
  [jellyAsset.assetId, adaAsset.assetId]
);
