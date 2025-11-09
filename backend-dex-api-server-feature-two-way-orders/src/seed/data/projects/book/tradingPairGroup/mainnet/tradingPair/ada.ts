import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {bookAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '98705e97-3abc-4615-a182-169c40c1f7f7',
  [bookAsset.assetId, adaAsset.assetId]
);
