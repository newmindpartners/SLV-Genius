import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {wrtAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'c69f939f-8c6a-475d-90b1-7822323ab6e9',
  [wrtAsset.assetId, adaAsset.assetId]
);
