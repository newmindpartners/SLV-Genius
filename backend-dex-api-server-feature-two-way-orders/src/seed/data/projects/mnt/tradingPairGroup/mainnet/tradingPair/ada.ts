import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {mntAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '7e0f7fea-679d-4342-8462-74482d102fe2',
  [mntAsset.assetId, adaAsset.assetId]
);
