import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {rjvAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '590ed091-47d7-4250-985f-73eee0a49bfa',
  [rjvAsset.assetId, adaAsset.assetId]
);
