import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {cnctAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'f4cdd22f-5429-4139-9f62-177c1099da55',
  [cnctAsset.assetId, adaAsset.assetId]
);
