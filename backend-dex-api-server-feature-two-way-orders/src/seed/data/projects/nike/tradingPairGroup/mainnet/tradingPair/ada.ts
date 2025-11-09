import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {nikeAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'edf03add-9bf8-457c-a6c2-8f7e5e9055a7',
  [nikeAsset.assetId, adaAsset.assetId]
);
