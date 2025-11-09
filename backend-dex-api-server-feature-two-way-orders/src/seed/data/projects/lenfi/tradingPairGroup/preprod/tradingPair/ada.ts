import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {lenfiAsset} from '../../../projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '204f7ed5-5b66-4da6-b833-505973956087',
  [lenfiAsset.assetId, adaAsset.assetId]
);
