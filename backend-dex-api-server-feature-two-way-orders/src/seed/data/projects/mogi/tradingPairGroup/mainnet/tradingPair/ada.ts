import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {mogiAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '058889f0-e52f-42aa-b335-90345c9257e2',
  [mogiAsset.assetId, adaAsset.assetId]
);
