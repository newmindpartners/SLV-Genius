import {soadaAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '6dae9ffc-faf9-4b99-9bf4-37bcb5cdb405',
  [soadaAsset.assetId, adaAsset.assetId]
);
