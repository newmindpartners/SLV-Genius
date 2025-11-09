import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {c4Asset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'bd8701fe-6a39-4eb4-8f03-cede0fa12c44',
  [c4Asset.assetId, adaAsset.assetId]
);
