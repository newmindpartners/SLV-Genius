/* eslint no-useless-escape: 0 */
import {Prisma} from '@prisma/client';

const orderSwapDump1 = `c581b933-84d9-4eef-94dd-e730a981cb0d	asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj	asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4	750000000	150000000	750000000	150000000	0	0	0.2	e5089c27-d15e-48ff-993d-a1bc472db528	LIMIT	OPEN	8c5cad955dcbffb42bcc3b51e3d9cb1728202b3eab2f8445f7e728f2bfee1cda	291854	\N	asset1z45x3cyqejklqr9ntgw63tu2r9u4ykzluwq5ch	2100000	1000000	0.3	450000	8c5cad955dcbffb42bcc3b51e3d9cb1728202b3eab2f8445f7e728f2bfee1cda	0	\N	\N	0	2024-03-05 09:32:08	2024-03-05 09:32:08	\N	\N	\N	2024-03-05 09:31:55.251	2024-03-05 09:32:38.545	5	1	\N	\N`;
const orderSwapDump2 = `389e62b2-08a7-4fea-b072-6adfa76a2cf0	asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj	asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4	1000000000	300000000	1000000000	300000000	0	0	0.3	e5089c27-d15e-48ff-993d-a1bc472db528	LIMIT	OPEN	bd8deed70d50045a3108ee386a55dd8e9f4141ee354f63b21c9d6bf6fc5562f7	285826	\N	asset1r5peuugc2mzfhee42r2yus9692jyls43e8je2n	2100000	1000000	0.3	900000	bd8deed70d50045a3108ee386a55dd8e9f4141ee354f63b21c9d6bf6fc5562f7	0	\N	\N	0	2024-03-05 09:39:31	2024-03-05 09:39:31	\N	\N	\N	2024-03-05 09:38:58.926	2024-03-05 09:39:41.36	10	3	\N	\N`;
const orderSwapDump3 = `9c45f1d7-da9e-4f1e-b9af-5871d8c2516d	asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj	asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4	500000000	200000000	500000000	200000000	0	0	0.4	e5089c27-d15e-48ff-993d-a1bc472db528	LIMIT	OPEN	2378a12ee570107bfcf018cd2a3af04eca7a4b01e8b5f3572af1cba975abb31c	291854	\N	asset1erg7r3m08k97alq5xw6w3zuc8fn3weda4eq496	2100000	1000000	0.3	600000	2378a12ee570107bfcf018cd2a3af04eca7a4b01e8b5f3572af1cba975abb31c	0	\N	\N	0	2024-03-05 09:41:11	2024-03-05 09:41:11	\N	\N	\N	2024-03-05 09:40:34.659	2024-03-05 09:41:21.609	5	2	\N	\N`;
const orderSwapDump4 = `3fd73424-cbae-4d5a-a50c-0db0bcde7366	asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj	asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4	200000000	100000000	200000000	100000000	0	0	0.5	e5089c27-d15e-48ff-993d-a1bc472db528	LIMIT	OPEN	17430f9e29f46597d87eebca4429afa7daeeade7b72a9cb0cc298afdb48793a4	285826	\N	asset1h0phhmc023ar5hdtnjkc6ll0lh46kd8hvkrxmh	2100000	1000000	0.3	300000	17430f9e29f46597d87eebca4429afa7daeeade7b72a9cb0cc298afdb48793a4	0	\N	\N	0	2024-03-05 09:41:30	2024-03-05 09:41:30	\N	\N	\N	2024-03-05 09:41:17.72	2024-03-05 09:41:52.453	2	1	\N	\N`;
const orderSwapDump5 = `be4a9ab7-f671-480d-b7c5-889f0d0a6fd9	asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj	asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4	400000000	80000000	400000000	80000000	0	0	0.2	aaabae63-f9f5-4612-8aab-9660fab7dda0	LIMIT	OPEN	552aed12fa99feacaa8670b02abf88d5be476e57e9d07196a79d79b631b1efa7	285826	\N	asset1jejhe7rgs24qm5hfue8ehh6x7jpkq6kste8rvv	2100000	1000000	0.3	240000	552aed12fa99feacaa8670b02abf88d5be476e57e9d07196a79d79b631b1efa7	0	\N	\N	0	2024-03-07 13:50:06	2024-03-07 13:50:06	\N	\N	\N	2024-03-07 13:49:18.026	2024-03-07 13:51:32.113	5	1	\N	\N`;
const orderSwapDump6 = `9ff56075-2ec5-4a23-8927-fb946a6475ab	asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj	asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4	50000000	150000000	50000000	150000000	0	0	3	aaabae63-f9f5-4612-8aab-9660fab7dda0	LIMIT	OPEN	b63a2b48688129da90e29f6f05303c8ed8c34c2305ee63e48b8888a7091e0a02	285826	\N	asset1ehxm0s7jkmga3wpxt97dkz5ns4309u50vyjms2	2100000	1000000	0.3	450000	b63a2b48688129da90e29f6f05303c8ed8c34c2305ee63e48b8888a7091e0a02	0	\N	\N	0	2024-03-07 13:52:51	2024-03-07 13:52:51	\N	\N	\N	2024-03-07 13:52:19.237	2024-03-07 13:53:11.484	1	3	\N	\N`;

const parseOrderSwapFromDump = (
  dumpData: string
): Prisma.OrderSwapUncheckedCreateInput => {
  const data = dumpData.split('\t');

  return {
    orderSwapId: data[0],
    toAssetId: data[1],
    fromAssetId: data[2],
    toAssetAmount: BigInt(data[3]),
    fromAssetAmount: BigInt(data[4]),
    toAssetAmountTotalRemaining: BigInt(data[5]),
    fromAssetAmountTotalRemaining: BigInt(data[6]),
    toAssetAmountTotalFilled: BigInt(data[7]),
    fromAssetAmountTotalFilled: BigInt(data[8]),
    price: parseFloat(data[9]),
    orderType: data[11] as Prisma.OrderSwapUncheckedCreateInput['orderType'],
    orderStatus:
      data[12] as Prisma.OrderSwapUncheckedCreateInput['orderStatus'],
    orderStatusTransactionHash: data[13] !== 'N' ? data[13] : null,
    transactionFeeAmount: data[14] !== 'N' ? BigInt(data[14]) : null,
    takerLovelaceFlatFeeAmount: data[15] !== 'N' ? BigInt(data[15]) : null,
    mintAssetId: data[16] !== 'N' ? data[16] : null,
    depositAmount: data[17] !== 'N' ? BigInt(data[17]) : null,
    makerLovelaceFlatFeeAmount: data[18] !== 'N' ? BigInt(data[18]) : null,
    makerFromAssetFeePercent: data[19] !== 'N' ? parseFloat(data[19]) : null,
    makerFromAssetFeeAmount: data[20] !== 'N' ? BigInt(data[20]) : null,
    utxoReferenceTransactionHash: data[21] !== 'N' ? data[21] : null,
    utxoReferenceIndex: data[22] !== 'N' ? parseInt(data[22]) : null,
    effectiveFromDate: data[23] !== 'N' ? new Date(data[23]) : null,
    effectiveUntilDate: data[24] !== 'N' ? new Date(data[24]) : null,
    partialFillCount: parseInt(data[25]),
    orderDate: new Date(data[26]),
    transactionDateOpen: data[27] !== 'N' ? new Date(data[27]) : null,
    transactionDateFill: data[28] !== 'N' ? new Date(data[28]) : null,
    transactionDateFinalFill: data[29] !== 'N' ? new Date(data[29]) : null,
    transactionDateCancel: data[30] !== 'N' ? new Date(data[30]) : null,
    created: new Date(data[31]),
    updated: new Date(data[32]),
    priceNumerator: data[33] !== 'N' ? data[33] : null,
    priceDenominator: data[34] !== 'N' ? data[34] : null,
    takerFromAssetFeePercent: data[35] !== 'N' ? parseFloat(data[35]) : null,
    takerFromAssetFeeAmount: data[36] !== 'N' ? BigInt(data[36]) : null,
  };
};

const orderSwap1 = parseOrderSwapFromDump(orderSwapDump1);
const orderSwap2 = parseOrderSwapFromDump(orderSwapDump2);
const orderSwap3 = parseOrderSwapFromDump(orderSwapDump3);
const orderSwap4 = parseOrderSwapFromDump(orderSwapDump4);
const orderSwap5 = parseOrderSwapFromDump(orderSwapDump5);
const orderSwap6 = parseOrderSwapFromDump(orderSwapDump6);

export const orderSwaps: Prisma.OrderSwapUncheckedCreateInput[] = [
  orderSwap1,
  orderSwap2,
  orderSwap3,
  orderSwap4,
  orderSwap5,
  orderSwap6,
];
