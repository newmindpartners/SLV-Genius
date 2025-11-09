import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {milkAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '0e03c31a-bf0a-48b6-bb9f-0a22ee709aca',
  [milkAsset.assetId, adaAsset.assetId]
);
