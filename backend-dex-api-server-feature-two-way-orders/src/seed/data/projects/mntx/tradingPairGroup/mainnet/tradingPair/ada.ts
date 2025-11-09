import {mntxAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '838a94ea-6a7e-47e8-9e36-c171e962f6f1',
  [mntxAsset.assetId, adaAsset.assetId]
);
