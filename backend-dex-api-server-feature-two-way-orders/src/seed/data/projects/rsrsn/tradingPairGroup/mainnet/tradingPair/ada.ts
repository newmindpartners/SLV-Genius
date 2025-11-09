import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {rsrsnAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '8e563d38-7465-46eb-9d84-c399b0231e60',
  [rsrsnAsset.assetId, adaAsset.assetId]
);
