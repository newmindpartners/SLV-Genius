import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {vyfiAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '2e8994b7-3f8b-48b9-9146-ec692d3169d6',
  [vyfiAsset.assetId, adaAsset.assetId]
);
