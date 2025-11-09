import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {encsAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'b60a0f77-aa83-4e43-8c50-23ba57a5ca48',
  [encsAsset.assetId, adaAsset.assetId]
);
