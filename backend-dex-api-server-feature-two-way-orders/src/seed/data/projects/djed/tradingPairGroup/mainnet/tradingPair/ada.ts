import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {djedAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '930426bd-ffde-4bd8-80b5-d9bc984f47b8',
  [djedAsset.assetId, adaAsset.assetId]
);
