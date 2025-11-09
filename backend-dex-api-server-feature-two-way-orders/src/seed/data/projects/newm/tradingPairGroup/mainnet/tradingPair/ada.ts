import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {newmAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '3e9e00cd-c4b6-413e-b8c1-c4ead5868155',
  [newmAsset.assetId, adaAsset.assetId]
);
