// MarketOrderPriceService.test.ts
import {MarketOrderPriceServiceImplementation} from '~/domain/services/marketOrder.service';
import {Asset, OrderSwapFill} from '~/domain/models/private';
import {mockOrderSwapFills} from '../mock';

describe('MarketOrderPriceServiceImplementation', () => {
  let service: MarketOrderPriceServiceImplementation;

  beforeEach(() => {
    service = new MarketOrderPriceServiceImplementation();
  });

  describe('calculateVWAPMarketPrice', () => {
    it('should calculate the VWAP for given order data A-B', () => {
      const vwap = service.calculateVWAPMarketPrice(
        mockOrderSwapFills,
        {
          assetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
          decimalPrecision: 6,
        } as Asset,
        {
          assetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
          decimalPrecision: 6,
        } as Asset
      );

      // Pre-calculated expected VWAP based on mock data
      const expectedVWAP = '1.98606615043565578155';

      expect(vwap.toString()).toBe(expectedVWAP.toString());
    });

    it('should calculate the VWAP for given order data B-A', () => {
      const vwap = service.calculateVWAPMarketPrice(
        mockOrderSwapFills,
        {
          assetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
          decimalPrecision: 6,
        } as Asset,
        {
          assetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
          decimalPrecision: 6,
        } as Asset
      );

      // Pre-calculated expected VWAP based on mock data
      const expectedVWAP = '0.50350790732976826454';

      expect(vwap.toString()).toBe(expectedVWAP.toString());
    });

    it('should return 0 if there are no valid order data', () => {
      const emptyOrders: OrderSwapFill[] = [];
      const vwap = service.calculateVWAPMarketPrice(
        emptyOrders,
        {
          assetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
          decimalPrecision: 6,
        } as Asset,
        {
          assetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
          decimalPrecision: 6,
        } as Asset
      );

      expect(vwap.toString()).toBe('0');
    });
  });
});
