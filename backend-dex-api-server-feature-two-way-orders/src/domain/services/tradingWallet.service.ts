import {singleton, injectable} from 'tsyringe';
import * as Private from '~/domain/models/private';
import {find} from 'lodash';

@singleton()
@injectable()
export class TradingWalletService {
  constructor() {}

  getDefaultProfitabilityMetricsArgs(): {
    binInterval: Private.BinInterval;
    windowInterval: Private.WindowInterval;
  } {
    return {
      binInterval: '1w',
      windowInterval: '3mo',
    };
  }

  getPriceAsset(
    assetPair: {
      assetOne: Private.Asset;
      assetTwo: Private.Asset;
    },
    priceAssetId: string
  ): Private.Asset | null {
    return find(assetPair, asset => asset.assetId === priceAssetId) || null;
  }
}
