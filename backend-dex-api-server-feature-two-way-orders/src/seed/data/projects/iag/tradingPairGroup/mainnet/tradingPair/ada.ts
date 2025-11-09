import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {iagAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '6bb7871a-1346-4fb9-a017-a08d5e081506',
  [iagAsset.assetId, adaAsset.assetId]
);
