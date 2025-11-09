import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {jpgAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'fe2fdfb6-daf1-4c05-bcd0-16da5a710e4f',
  [jpgAsset.assetId, adaAsset.assetId]
);
