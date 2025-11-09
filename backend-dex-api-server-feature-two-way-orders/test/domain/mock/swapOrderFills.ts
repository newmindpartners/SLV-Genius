/* eslint-disable node/no-unpublished-import */
import {createMock} from 'ts-auto-mock';
import {OrderSwapFill} from '~/domain/models/private';

const mockOrderSwap = (orderSwap: Partial<OrderSwapFill>): OrderSwapFill => ({
  ...createMock<OrderSwapFill>(),
  ...orderSwap,
});

export const mockOrderSwapFills: OrderSwapFill[] = [
  mockOrderSwap({
    toAssetAmountFilled: BigInt(20000000),
    fromAssetAmountFilled: BigInt(100000000),
    toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    price: 5,
  }),
  mockOrderSwap({
    toAssetAmountFilled: BigInt(64566116),
    fromAssetAmountFilled: BigInt(500000000),
    toAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    fromAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    price: 7.743999964315648,
  }),
  mockOrderSwap({
    toAssetAmountFilled: BigInt(500000000),
    fromAssetAmountFilled: BigInt(250000000),
    toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    price: 0.5,
  }),
  mockOrderSwap({
    toAssetAmountFilled: BigInt(20955602),
    fromAssetAmountFilled: BigInt(911113087),
    toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    price: 43.47826086956522,
  }),
  mockOrderSwap({
    toAssetAmountFilled: BigInt(698520066),
    fromAssetAmountFilled: BigInt(20955602),
    toAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    fromAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    price: 0.02999999998695652,
  }),
  mockOrderSwap({
    toAssetAmountFilled: BigInt(2044398),
    fromAssetAmountFilled: BigInt(88886913),
    toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    price: 43.47826086956522,
  }),
  mockOrderSwap({
    toAssetAmountFilled: BigInt(1),
    fromAssetAmountFilled: BigInt(1),
    toAssetId: 'asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4',
    fromAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    price: 25.71428571428572,
  }),
];
