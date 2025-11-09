import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {shenAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '364b6903-a00b-4e53-820d-d0fd3cff42b5',
  [shenAsset.assetId, adaAsset.assetId]
);
