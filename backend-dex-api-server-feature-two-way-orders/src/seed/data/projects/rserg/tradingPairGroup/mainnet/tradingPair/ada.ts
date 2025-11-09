import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {rsergAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '2513e1b2-908d-4e47-bd95-ac98e8482e17',
  [rsergAsset.assetId, adaAsset.assetId]
);
