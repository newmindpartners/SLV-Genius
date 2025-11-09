import {gensxAsset} from '../../../projectGroup/mainnet';
import {usdmAsset} from '~/seed/data/projects/usdm/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '63098bb7-4609-408f-9d65-968f4530caf3',
  [gensxAsset.assetId, usdmAsset.assetId]
);
