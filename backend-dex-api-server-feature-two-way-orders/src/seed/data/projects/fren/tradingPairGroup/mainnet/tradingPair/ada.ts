import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {frenAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '0f6d33e7-c9d5-430a-b891-b12624c40d8e',
  [frenAsset.assetId, adaAsset.assetId]
);
