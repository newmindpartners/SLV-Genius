import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {axoAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '65fa6088-032a-4b73-87d5-f807c4c08462',
  [axoAsset.assetId, adaAsset.assetId]
);
