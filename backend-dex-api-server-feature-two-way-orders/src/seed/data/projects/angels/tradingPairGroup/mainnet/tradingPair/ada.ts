import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {angelsAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'a4c2dc00-e718-4abe-9fe9-85ba1df0145d',
  [angelsAsset.assetId, adaAsset.assetId]
);
