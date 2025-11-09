import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {fldtAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '4a8cebe3-36c6-4a2c-9e6d-0808f9a73f4b',
  [fldtAsset.assetId, adaAsset.assetId]
);
