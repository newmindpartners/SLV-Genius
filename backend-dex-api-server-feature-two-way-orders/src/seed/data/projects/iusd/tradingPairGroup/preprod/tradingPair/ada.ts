import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {iusdAsset} from '../../../projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'dd6c7641-b8ef-4d3b-aec7-0e3fb6f23756',
  [iusdAsset.assetId, adaAsset.assetId]
);
