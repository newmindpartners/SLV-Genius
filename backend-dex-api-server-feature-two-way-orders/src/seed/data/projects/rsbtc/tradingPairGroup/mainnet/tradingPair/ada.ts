import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {rsbtcAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'cea89b3f-918b-403c-800a-0ce4a24d73b7',
  [rsbtcAsset.assetId, adaAsset.assetId]
);
