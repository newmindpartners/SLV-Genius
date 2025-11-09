import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {minAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '16b57526-0b6a-4f59-8891-4d714f508f77',
  [minAsset.assetId, adaAsset.assetId]
);
