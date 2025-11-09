import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {dripAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '934061b8-3529-43a2-a2aa-30e72c44f3f6',
  [dripAsset.assetId, adaAsset.assetId]
);
