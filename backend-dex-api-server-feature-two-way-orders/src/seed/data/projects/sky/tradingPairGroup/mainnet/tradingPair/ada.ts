import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {skyAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '11876673-c596-4ffb-858d-eacd3f3c673d',
  [skyAsset.assetId, adaAsset.assetId]
);
