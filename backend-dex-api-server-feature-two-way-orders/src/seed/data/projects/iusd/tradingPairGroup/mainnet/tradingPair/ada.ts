import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {iusdAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '3f47da1c-40a6-4ff2-8118-89a7b9368a50',
  [iusdAsset.assetId, adaAsset.assetId]
);
