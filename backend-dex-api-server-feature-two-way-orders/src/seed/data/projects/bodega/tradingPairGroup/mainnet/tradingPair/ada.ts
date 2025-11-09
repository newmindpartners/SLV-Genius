import {bodegaAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'baefb039-2307-41c9-ba01-808d465b4437',
  [bodegaAsset.assetId, adaAsset.assetId]
);
