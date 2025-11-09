import {gensxAsset} from '../../../projectGroup/mainnet';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '36e57d67-70fe-4511-b955-0c62528265dd',
  [gensxAsset.assetId, adaAsset.assetId]
);
