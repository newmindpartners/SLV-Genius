import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {milkAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '357fef49-8b12-445c-86ed-8dcac5d74882',
  [milkAsset.assetId, adaAsset.assetId]
);
