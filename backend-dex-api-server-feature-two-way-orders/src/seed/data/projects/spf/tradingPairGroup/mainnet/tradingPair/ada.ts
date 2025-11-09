import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {spfAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '5539af11-f8e6-4588-9185-9857088ca5c1',
  [spfAsset.assetId, adaAsset.assetId]
);
