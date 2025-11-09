import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {wmtAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '6ebd3c3c-d30a-4ae8-90ad-a5dc2bd41fe8',
  [wmtAsset.assetId, adaAsset.assetId]
);
