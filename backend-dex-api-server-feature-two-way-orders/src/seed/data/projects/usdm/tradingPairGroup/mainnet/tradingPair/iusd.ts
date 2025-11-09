import {usdmAsset} from '../../../projectGroup/mainnet/asset';
import {iusdAsset} from '~/seed/data/projects/iusd/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '78b0e26f-7794-44a5-a6ff-851719db3e9f',
  [usdmAsset.assetId, iusdAsset.assetId]
);
