import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {meldAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '230c1a59-edd7-4c3f-bcaf-dfd500fddf6a',
  [meldAsset.assetId, adaAsset.assetId]
);
