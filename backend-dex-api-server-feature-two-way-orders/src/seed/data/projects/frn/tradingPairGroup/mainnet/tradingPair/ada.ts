import {frnAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '6838b5cc-2ebc-4de5-9f45-bdaf4834709b',
  [frnAsset.assetId, adaAsset.assetId]
);
