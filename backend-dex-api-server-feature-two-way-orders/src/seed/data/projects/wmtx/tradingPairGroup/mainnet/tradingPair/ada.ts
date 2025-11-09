import {wmtxAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '2214892f-577c-455d-b847-cdeb506b18c9',
  [wmtxAsset.assetId, adaAsset.assetId]
);
