import {gensxAsset} from '../../../projectGroup/mainnet';
import {iusdAsset} from '~/seed/data/projects/iusd/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '5e14fc09-8512-4af8-b656-2de88fb856a9',
  [gensxAsset.assetId, iusdAsset.assetId]
);
