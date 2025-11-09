import {gensAsset} from '../../../projectGroup/mainnet';
import {djedAsset} from '~/seed/data/projects/djed/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '55dbed82-8d6f-4ae8-88ef-2ddcf42f0971',
  [gensAsset.assetId, djedAsset.assetId]
);
