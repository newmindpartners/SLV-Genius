import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {clarityAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '5f2d7512-ff7c-44d2-9ba6-9ddfd5ae582d',
  [clarityAsset.assetId, adaAsset.assetId]
);
