import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {agixAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '5d947210-25a7-4c81-a440-f398c3f71a87',
  [agixAsset.assetId, adaAsset.assetId]
);
