/* eslint no-useless-escape: 0 */
import {Event, Prisma} from '@prisma/client';

const parseEventFromDump = (dumpData: string): Prisma.EventCreateManyInput => {
  const data = dumpData.split('\t');

  return {
    eventId: data[0],
    streamId: data[1],
    streamVersion: parseInt(data[2]),
    eventType: data[3] as Event['eventType'],
    eventPayload: JSON.parse(data[4]),
    eventVersion: parseInt(data[5]),
    created: new Date(data[6]),
    transactionHash: data[7] !== 'N' ? data[7] : null,
    blockHash: data[8] !== 'N' ? data[8] : null,
    blockSlot: data[9] !== 'N' ? BigInt(data[9]) : null,
  };
};

const eventDump11 = `de3928f6-d227-451f-89bd-a4b9c5afddde	c581b933-84d9-4eef-94dd-e730a981cb0d	1	ORDER_SWAP__OPEN_INIT__REQUEST	{"userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "baseAssetAmount": "750000000", "quoteAssetAmount": "150000000"}	1	2024-03-05 09:31:55.251	\N	\N	\N`;
const eventDump12 = `8f064569-ee00-4ecb-8e40-c92513bf1aab	c581b933-84d9-4eef-94dd-e730a981cb0d	2	ORDER_SWAP__OPEN_INIT__SUCCESS	{"userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "mintAssetId": "asset1z45x3cyqejklqr9ntgw63tu2r9u4ykzluwq5ch", "orderSwapId": "c581b933-84d9-4eef-94dd-e730a981cb0d", "depositAmount": "2100000", "transactionFeeAmount": "291854", "makerQuoteAssetFeeAmount": "450000", "makerQuoteAssetFeePercent": "0.3", "makerLovelaceFlatFeeAmount": "1000000"}	1	2024-03-05 09:31:55.251	8c5cad955dcbffb42bcc3b51e3d9cb1728202b3eab2f8445f7e728f2bfee1cda	\N	\N`;
const eventDump13 = `dc2994bd-c997-42f8-9d31-20561136fd76	c581b933-84d9-4eef-94dd-e730a981cb0d	3	ORDER_SWAP__OPEN_SUBMIT__SUCCESS	{"orderSwapId": "c581b933-84d9-4eef-94dd-e730a981cb0d"}	1	2024-03-05 09:32:04.148	8c5cad955dcbffb42bcc3b51e3d9cb1728202b3eab2f8445f7e728f2bfee1cda	\N	\N`;
const eventDump14 = `6f4af848-e3f5-4543-be8d-e2e41c4cc4b0	c581b933-84d9-4eef-94dd-e730a981cb0d	4	ORDER_SWAP__OPEN_ONCHAIN__SUCCESS	{"price": 0.2, "userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "mintAssetId": "asset1z45x3cyqejklqr9ntgw63tu2r9u4ykzluwq5ch", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "priceNumerator": "1", "baseAssetAmount": "750000000", "partialFillCount": 0, "priceDenominator": "5", "quoteAssetAmount": "150000000", "effectiveFromDate": null, "effectiveUntilDate": null, "utxoReferenceIndex": 0, "transactionFeeAmount": "291854", "transactionTimestamp": 1709631128, "baseAssetAmountTotalFilled": "0", "quoteAssetAmountTotalFilled": "0", "utxoReferenceTransactionHash": "8c5cad955dcbffb42bcc3b51e3d9cb1728202b3eab2f8445f7e728f2bfee1cda", "baseAssetAmountTotalRemaining": "750000000", "quoteAssetAmountTotalRemaining": "150000000"}	1	2024-03-05 09:32:38.509	8c5cad955dcbffb42bcc3b51e3d9cb1728202b3eab2f8445f7e728f2bfee1cda	e801a4f40ef6ee3dcf8f27d05fe892ed7603854b2ac23026652d2008a0de1d9d	53947928`;

const orderSwap1Events = [
  parseEventFromDump(eventDump11),
  parseEventFromDump(eventDump12),
  parseEventFromDump(eventDump13),
  parseEventFromDump(eventDump14),
];

const eventDump21 = `0533820d-0ef5-4f1b-91dd-3a09ffeb2254	389e62b2-08a7-4fea-b072-6adfa76a2cf0	1	ORDER_SWAP__OPEN_INIT__REQUEST	{"userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "baseAssetAmount": "1000000000", "quoteAssetAmount": "300000000"}	1	2024-03-05 09:38:58.926	\N	\N	\N`;
const eventDump22 = `e2b30555-adbc-4714-a6d9-7cd5d65917f3	389e62b2-08a7-4fea-b072-6adfa76a2cf0	2	ORDER_SWAP__OPEN_INIT__SUCCESS	{"userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "mintAssetId": "asset1r5peuugc2mzfhee42r2yus9692jyls43e8je2n", "orderSwapId": "389e62b2-08a7-4fea-b072-6adfa76a2cf0", "depositAmount": "2100000", "transactionFeeAmount": "285826", "makerQuoteAssetFeeAmount": "900000", "makerQuoteAssetFeePercent": "0.3", "makerLovelaceFlatFeeAmount": "1000000"}	1	2024-03-05 09:38:58.926	bd8deed70d50045a3108ee386a55dd8e9f4141ee354f63b21c9d6bf6fc5562f7	\N	\N`;
const eventDump23 = `28b1fe55-41be-4f6e-b905-23e4397edca0	389e62b2-08a7-4fea-b072-6adfa76a2cf0	3	ORDER_SWAP__OPEN_SUBMIT__SUCCESS	{"orderSwapId": "389e62b2-08a7-4fea-b072-6adfa76a2cf0"}	1	2024-03-05 09:39:06.869	bd8deed70d50045a3108ee386a55dd8e9f4141ee354f63b21c9d6bf6fc5562f7	\N	\N`;
const eventDump24 = `b0f126b5-3101-49fe-a25c-1ee8d2278041	389e62b2-08a7-4fea-b072-6adfa76a2cf0	4	ORDER_SWAP__OPEN_ONCHAIN__SUCCESS	{"price": 0.3, "userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "mintAssetId": "asset1r5peuugc2mzfhee42r2yus9692jyls43e8je2n", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "priceNumerator": "3", "baseAssetAmount": "1000000000", "partialFillCount": 0, "priceDenominator": "10", "quoteAssetAmount": "300000000", "effectiveFromDate": null, "effectiveUntilDate": null, "utxoReferenceIndex": 0, "transactionFeeAmount": "285826", "transactionTimestamp": 1709631571, "baseAssetAmountTotalFilled": "0", "quoteAssetAmountTotalFilled": "0", "utxoReferenceTransactionHash": "bd8deed70d50045a3108ee386a55dd8e9f4141ee354f63b21c9d6bf6fc5562f7", "baseAssetAmountTotalRemaining": "1000000000", "quoteAssetAmountTotalRemaining": "300000000"}	1	2024-03-05 09:39:41.34	bd8deed70d50045a3108ee386a55dd8e9f4141ee354f63b21c9d6bf6fc5562f7	4ed50b2072b500392eb1a0087ef89af7a55dc380a2f9c31ccf75e79cf3127958	53948371`;

const orderSwap2Events = [
  parseEventFromDump(eventDump21),
  parseEventFromDump(eventDump22),
  parseEventFromDump(eventDump23),
  parseEventFromDump(eventDump24),
];

const eventDump31 = `c4bc11b3-ec06-42ee-9574-7a3d18531936	9c45f1d7-da9e-4f1e-b9af-5871d8c2516d	3	ORDER_SWAP__OPEN_SUBMIT__SUCCESS	{"orderSwapId": "9c45f1d7-da9e-4f1e-b9af-5871d8c2516d"}	1	2024-03-05 09:40:42.506	2378a12ee570107bfcf018cd2a3af04eca7a4b01e8b5f3572af1cba975abb31c	\N	\N`;
const eventDump32 = `07f2676c-1854-4830-977e-263647900b06	9c45f1d7-da9e-4f1e-b9af-5871d8c2516d	1	ORDER_SWAP__OPEN_INIT__REQUEST	{"userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "baseAssetAmount": "500000000", "quoteAssetAmount": "200000000"}	1	2024-03-05 09:40:34.659	\N	\N	\N`;
const eventDump33 = `4799906e-84f6-4c0e-8321-666c2532cc21	9c45f1d7-da9e-4f1e-b9af-5871d8c2516d	2	ORDER_SWAP__OPEN_INIT__SUCCESS	{"userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "mintAssetId": "asset1erg7r3m08k97alq5xw6w3zuc8fn3weda4eq496", "orderSwapId": "9c45f1d7-da9e-4f1e-b9af-5871d8c2516d", "depositAmount": "2100000", "transactionFeeAmount": "291854", "makerQuoteAssetFeeAmount": "600000", "makerQuoteAssetFeePercent": "0.3", "makerLovelaceFlatFeeAmount": "1000000"}	1	2024-03-05 09:40:34.659	2378a12ee570107bfcf018cd2a3af04eca7a4b01e8b5f3572af1cba975abb31c	\N	\N`;
const eventDump34 = `5e637822-e67b-409a-a89b-24e520fe9eae	9c45f1d7-da9e-4f1e-b9af-5871d8c2516d	4	ORDER_SWAP__OPEN_ONCHAIN__SUCCESS	{"price": 0.4, "userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "mintAssetId": "asset1erg7r3m08k97alq5xw6w3zuc8fn3weda4eq496", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "priceNumerator": "2", "baseAssetAmount": "500000000", "partialFillCount": 0, "priceDenominator": "5", "quoteAssetAmount": "200000000", "effectiveFromDate": null, "effectiveUntilDate": null, "utxoReferenceIndex": 0, "transactionFeeAmount": "291854", "transactionTimestamp": 1709631671, "baseAssetAmountTotalFilled": "0", "quoteAssetAmountTotalFilled": "0", "utxoReferenceTransactionHash": "2378a12ee570107bfcf018cd2a3af04eca7a4b01e8b5f3572af1cba975abb31c", "baseAssetAmountTotalRemaining": "500000000", "quoteAssetAmountTotalRemaining": "200000000"}	1	2024-03-05 09:41:21.585	2378a12ee570107bfcf018cd2a3af04eca7a4b01e8b5f3572af1cba975abb31c	fd856c9be4772ca3475e4507606c959d08fd94d936bb306cc881b5a27cc63cb4	53948471`;

const orderSwap3Events = [
  parseEventFromDump(eventDump31),
  parseEventFromDump(eventDump32),
  parseEventFromDump(eventDump33),
  parseEventFromDump(eventDump34),
];

const eventDump41 = `5c7197a3-961f-43c5-b4ac-229694b1023c	3fd73424-cbae-4d5a-a50c-0db0bcde7366	1	ORDER_SWAP__OPEN_INIT__REQUEST	{"userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "baseAssetAmount": "200000000", "quoteAssetAmount": "100000000"}	1	2024-03-05 09:41:17.72	\N	\N	\N`;
const eventDump42 = `eff7c527-49bc-45ac-80bf-045be943c9c0	3fd73424-cbae-4d5a-a50c-0db0bcde7366	2	ORDER_SWAP__OPEN_INIT__SUCCESS	{"userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "mintAssetId": "asset1h0phhmc023ar5hdtnjkc6ll0lh46kd8hvkrxmh", "orderSwapId": "3fd73424-cbae-4d5a-a50c-0db0bcde7366", "depositAmount": "2100000", "transactionFeeAmount": "285826", "makerQuoteAssetFeeAmount": "300000", "makerQuoteAssetFeePercent": "0.3", "makerLovelaceFlatFeeAmount": "1000000"}	1	2024-03-05 09:41:17.72	17430f9e29f46597d87eebca4429afa7daeeade7b72a9cb0cc298afdb48793a4	\N	\N`;
const eventDump43 = `ff7ba905-1e74-48e1-8210-9caacb664e6b	3fd73424-cbae-4d5a-a50c-0db0bcde7366	3	ORDER_SWAP__OPEN_SUBMIT__SUCCESS	{"orderSwapId": "3fd73424-cbae-4d5a-a50c-0db0bcde7366"}	1	2024-03-05 09:41:25.008	17430f9e29f46597d87eebca4429afa7daeeade7b72a9cb0cc298afdb48793a4	\N	\N`;
const eventDump44 = `05aca345-cb8c-4910-bda1-9fb416ef0ce3	3fd73424-cbae-4d5a-a50c-0db0bcde7366	4	ORDER_SWAP__OPEN_ONCHAIN__SUCCESS	{"price": 0.5, "userId": "e5089c27-d15e-48ff-993d-a1bc472db528", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "mintAssetId": "asset1h0phhmc023ar5hdtnjkc6ll0lh46kd8hvkrxmh", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "priceNumerator": "1", "baseAssetAmount": "200000000", "partialFillCount": 0, "priceDenominator": "2", "quoteAssetAmount": "100000000", "effectiveFromDate": null, "effectiveUntilDate": null, "utxoReferenceIndex": 0, "transactionFeeAmount": "285826", "transactionTimestamp": 1709631690, "baseAssetAmountTotalFilled": "0", "quoteAssetAmountTotalFilled": "0", "utxoReferenceTransactionHash": "17430f9e29f46597d87eebca4429afa7daeeade7b72a9cb0cc298afdb48793a4", "baseAssetAmountTotalRemaining": "200000000", "quoteAssetAmountTotalRemaining": "100000000"}	1	2024-03-05 09:41:52.429	17430f9e29f46597d87eebca4429afa7daeeade7b72a9cb0cc298afdb48793a4	594b0fdd42a3bd9444f9973c799e39b9092e51cf121e11bbfc990b7c8e8148d0	53948490`;

const orderSwap4Events = [
  parseEventFromDump(eventDump41),
  parseEventFromDump(eventDump42),
  parseEventFromDump(eventDump43),
  parseEventFromDump(eventDump44),
];

const eventDump51 = `38f1edd5-8752-4c10-b760-f729d8f7d0e6	be4a9ab7-f671-480d-b7c5-889f0d0a6fd9	1	ORDER_SWAP__OPEN_INIT__REQUEST	{"userId": "aaabae63-f9f5-4612-8aab-9660fab7dda0", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "baseAssetAmount": "400000000", "quoteAssetAmount": "80000000"}	1	2024-03-07 13:49:18.026	\N	\N	\N`;
const eventDump52 = `fcb9099f-2849-4631-9a86-abfd6fe6eb2d	be4a9ab7-f671-480d-b7c5-889f0d0a6fd9	2	ORDER_SWAP__OPEN_INIT__SUCCESS	{"userId": "aaabae63-f9f5-4612-8aab-9660fab7dda0", "mintAssetId": "asset1jejhe7rgs24qm5hfue8ehh6x7jpkq6kste8rvv", "orderSwapId": "be4a9ab7-f671-480d-b7c5-889f0d0a6fd9", "depositAmount": "2100000", "transactionFeeAmount": "285826", "makerQuoteAssetFeeAmount": "240000", "makerQuoteAssetFeePercent": "0.3", "makerLovelaceFlatFeeAmount": "1000000"}	1	2024-03-07 13:49:18.026	552aed12fa99feacaa8670b02abf88d5be476e57e9d07196a79d79b631b1efa7	\N	\N`;
const eventDump53 = `0e0b23c3-c1aa-43c9-8f38-5cc098672ead	be4a9ab7-f671-480d-b7c5-889f0d0a6fd9	3	ORDER_SWAP__OPEN_SUBMIT__SUCCESS	{"orderSwapId": "be4a9ab7-f671-480d-b7c5-889f0d0a6fd9"}	1	2024-03-07 13:49:31.655	552aed12fa99feacaa8670b02abf88d5be476e57e9d07196a79d79b631b1efa7	\N	\N`;
const eventDump54 = `13c0ad40-1111-4090-9a21-b3ac093a708d	be4a9ab7-f671-480d-b7c5-889f0d0a6fd9	4	ORDER_SWAP__OPEN_ONCHAIN__SUCCESS	{"price": 0.2, "userId": "aaabae63-f9f5-4612-8aab-9660fab7dda0", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "mintAssetId": "asset1jejhe7rgs24qm5hfue8ehh6x7jpkq6kste8rvv", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "priceNumerator": "1", "baseAssetAmount": "400000000", "partialFillCount": 0, "priceDenominator": "5", "quoteAssetAmount": "80000000", "effectiveFromDate": null, "effectiveUntilDate": null, "utxoReferenceIndex": 0, "transactionFeeAmount": "285826", "transactionTimestamp": 1709819406, "baseAssetAmountTotalFilled": "0", "quoteAssetAmountTotalFilled": "0", "utxoReferenceTransactionHash": "552aed12fa99feacaa8670b02abf88d5be476e57e9d07196a79d79b631b1efa7", "baseAssetAmountTotalRemaining": "400000000", "quoteAssetAmountTotalRemaining": "80000000"}	1	2024-03-07 13:51:32.105	552aed12fa99feacaa8670b02abf88d5be476e57e9d07196a79d79b631b1efa7	8536566f4e937aef34d76e7a5645d93f28f3e7771b0ec41f79ed9dbee8a05888	54136206`;

const orderSwap5Events = [
  parseEventFromDump(eventDump51),
  parseEventFromDump(eventDump52),
  parseEventFromDump(eventDump53),
  parseEventFromDump(eventDump54),
];

const eventDump61 = `a2d2633c-4c4d-47ff-81b8-204767f6bead	9ff56075-2ec5-4a23-8927-fb946a6475ab	1	ORDER_SWAP__OPEN_INIT__REQUEST	{"userId": "aaabae63-f9f5-4612-8aab-9660fab7dda0", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "baseAssetAmount": "50000000", "quoteAssetAmount": "150000000"}	1	2024-03-07 13:52:19.237	\N	\N	\N`;
const eventDump62 = `b75915ae-9ecd-4c02-806e-95e29c587457	9ff56075-2ec5-4a23-8927-fb946a6475ab	2	ORDER_SWAP__OPEN_INIT__SUCCESS	{"userId": "aaabae63-f9f5-4612-8aab-9660fab7dda0", "mintAssetId": "asset1ehxm0s7jkmga3wpxt97dkz5ns4309u50vyjms2", "orderSwapId": "9ff56075-2ec5-4a23-8927-fb946a6475ab", "depositAmount": "2100000", "transactionFeeAmount": "285826", "makerQuoteAssetFeeAmount": "450000", "makerQuoteAssetFeePercent": "0.3", "makerLovelaceFlatFeeAmount": "1000000"}	1	2024-03-07 13:52:19.237	b63a2b48688129da90e29f6f05303c8ed8c34c2305ee63e48b8888a7091e0a02	\N	\N`;
const eventDump63 = `ee43cd3c-8f1a-4487-8d38-9c583771d275	9ff56075-2ec5-4a23-8927-fb946a6475ab	3	ORDER_SWAP__OPEN_SUBMIT__SUCCESS	{"orderSwapId": "9ff56075-2ec5-4a23-8927-fb946a6475ab"}	1	2024-03-07 13:52:27.016	b63a2b48688129da90e29f6f05303c8ed8c34c2305ee63e48b8888a7091e0a02	\N	\N`;
const eventDump64 = `97ee2180-45ca-4a43-8c3d-e0129f13f412	9ff56075-2ec5-4a23-8927-fb946a6475ab	4	ORDER_SWAP__OPEN_ONCHAIN__SUCCESS	{"price": 3, "userId": "aaabae63-f9f5-4612-8aab-9660fab7dda0", "orderType": "LIMIT", "baseAssetId": "asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj", "mintAssetId": "asset1ehxm0s7jkmga3wpxt97dkz5ns4309u50vyjms2", "quoteAssetId": "asset1mvqjrt76g9yxsle3z92ums7snlpg02p274gek4", "priceNumerator": "3", "baseAssetAmount": "50000000", "partialFillCount": 0, "priceDenominator": "1", "quoteAssetAmount": "150000000", "effectiveFromDate": null, "effectiveUntilDate": null, "utxoReferenceIndex": 0, "transactionFeeAmount": "285826", "transactionTimestamp": 1709819571, "baseAssetAmountTotalFilled": "0", "quoteAssetAmountTotalFilled": "0", "utxoReferenceTransactionHash": "b63a2b48688129da90e29f6f05303c8ed8c34c2305ee63e48b8888a7091e0a02", "baseAssetAmountTotalRemaining": "50000000", "quoteAssetAmountTotalRemaining": "150000000"}	1	2024-03-07 13:53:11.468	b63a2b48688129da90e29f6f05303c8ed8c34c2305ee63e48b8888a7091e0a02	4d75d5a4a1a877c3ba7f96d6e938ef2fe0262ac1a3aafb01be3935c8fb658e92	54136371`;

const orderSwap6Events = [
  parseEventFromDump(eventDump61),
  parseEventFromDump(eventDump62),
  parseEventFromDump(eventDump63),
  parseEventFromDump(eventDump64),
];

export const events: Prisma.EventCreateManyInput[] = [
  ...orderSwap1Events,
  ...orderSwap2Events,
  ...orderSwap3Events,
  ...orderSwap4Events,
  ...orderSwap5Events,
  ...orderSwap6Events,
];
