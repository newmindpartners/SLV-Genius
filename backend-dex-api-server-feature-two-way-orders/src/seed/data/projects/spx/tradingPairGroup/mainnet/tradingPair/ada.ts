import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {spxAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'dd43493b-8f2d-46e7-adfa-69b9416a0019',
  [spxAsset.assetId, adaAsset.assetId]
);
