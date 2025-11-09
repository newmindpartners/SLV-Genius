import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {dingAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'da75671e-2725-47c7-87e0-aa7799cbe6f7',
  [dingAsset.assetId, adaAsset.assetId]
);
