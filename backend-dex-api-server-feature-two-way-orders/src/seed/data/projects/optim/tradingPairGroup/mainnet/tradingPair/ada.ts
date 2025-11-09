import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {optimAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '864712ba-d3e2-4f2d-b792-c104a53a38e1',
  [optimAsset.assetId, adaAsset.assetId]
);
