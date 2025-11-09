import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {lenfiAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '79112bb2-09ed-4736-b8f6-fb3a9e2bd4f0',
  [lenfiAsset.assetId, adaAsset.assetId]
);
