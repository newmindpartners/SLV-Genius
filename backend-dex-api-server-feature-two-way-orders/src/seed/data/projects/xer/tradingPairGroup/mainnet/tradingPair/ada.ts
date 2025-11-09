import {xerAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '64eef080-86a3-4856-b6ee-841d6a0b669a',
  [xerAsset.assetId, adaAsset.assetId]
);
