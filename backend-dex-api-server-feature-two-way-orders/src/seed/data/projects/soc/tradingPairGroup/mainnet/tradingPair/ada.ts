import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {socAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '5a476412-4ac3-43ab-873b-b803f5276889',
  [socAsset.assetId, adaAsset.assetId]
);
