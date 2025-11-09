import MemoizedStatusChip from '~/components/StatusChip';
import { RowWithSubrows } from '~/components/Table';
import { Headline } from '~/components/Table';
import { SwapOrder } from '~/redux/api';

import CellWrapper from '../SmartVaults/components/CellWrapper/CellWrapper';
import { IChartData } from '../TradingWallet/helpers/getChartItemsByMode';

export const tableRowsSmartVaultDetails: RowWithSubrows[] = [
  {
    id: 1,
    cells: [
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: 'Deposit',
        align: 'left',
      },
      {
        content: 'Open',
        decorator: (content) => (
          <MemoizedStatusChip content={content} order={singleSwapOrder} />
        ),
        align: 'left',
      },
      { content: '0.5 ADA', align: 'left' },
      { content: '2022-03-14, 5:45 PM', align: 'left' },
    ],
    subrows: [],
  },
  {
    id: 2,
    cells: [
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: 'Deposit',
        align: 'left',
      },
      {
        content: 'Open',
        decorator: (content) => (
          <MemoizedStatusChip content={content} order={singleSwapOrder} />
        ),
        align: 'left',
      },
      { content: '0.5 ADA', align: 'left' },
      { content: '2022-03-14, 5:45 PM', align: 'left' },
    ],
    subrows: [],
  },
  {
    id: 3,
    cells: [
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: 'Deposit',
        align: 'left',
      },
      {
        content: 'Open',
        decorator: (content) => (
          <MemoizedStatusChip content={content} order={singleSwapOrder} />
        ),
        align: 'left',
      },
      { content: '0.5 ADA', align: 'left' },
      { content: '2022-03-14, 5:45 PM', align: 'left' },
    ],
    subrows: [],
  },
  {
    id: 4,
    cells: [
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: 'Deposit',
        align: 'left',
      },
      {
        content: 'Open',
        decorator: (content) => (
          <MemoizedStatusChip content={content} order={singleSwapOrder} />
        ),
        align: 'left',
      },
      { content: '0.5 ADA', align: 'left' },
      { content: '2022-03-14, 5:45 PM', align: 'left' },
    ],
    subrows: [],
  },
];

export const smartVaultDetailsTableHeadlines: Headline[] = [
  { content: 'Amount', align: 'left', sortKey: 'from' },
  { content: '', align: 'left' },
  { content: '', align: 'left' },
  { content: 'Type', align: 'left', sortKey: 'from' },
  { content: 'Status', align: 'left', sortKey: 'from' },
  { content: 'Fee', align: 'left', sortKey: 'from' },
  { content: 'Time', align: 'left', sortKey: 'from' },
];

export const smartVaultDetailsChartData: IChartData = {
  dataPoints: [
    {
      time: 1243124,
    },
    {
      time: 2642646,
    },
    {
      time: 7274361,
    },
    {
      time: 8847474,
    },
  ],
  priceAsset: {
    assetId: '1',
    policyId: '1',
    assetName: 'ADA',
    shortName: 'ADA',
    longName: 'ADA',
    iconUrl: '/cdn/ADA.png',
    decimalPrecision: 1,
  },
};

const singleSwapOrder: SwapOrder = {
  created: '2024-10-29T20:41:08.000Z',
  fromAsset: {
    assetId: 'asset1yg69thkk8j7sd8cdry0h89knea5fmp3dzx9hjq',
    assetName: '0014df1047454e5358',
    decimalPrecision: 6,
    enabled: true,
    iconUrl: '/cdn/GENSX.png',
    longName: 'Genius X',
    policyId: 'fbae99b8679369079a7f6f0da14a2cf1c2d6bfd3afdf3a96a64ab67a',
    referenceAssetAmount: '',
    referenceAssetId: '',
    shortName: 'GENSX',
  },
  fromAssetAmount: '230000000000',
  fromAssetAmountFilled: '0',
  fromAssetAmountRemaining: '230000000000',
  fromAssetId: 'asset1yg69thkk8j7sd8cdry0h89knea5fmp3dzx9hjq',
  makerFromAssetFeeAmount: '0',
  makerFromAssetFeePercent: '0.3',
  makerLovelaceFlatFeeAmount: '0',
  minFillFromAssetAmount: '1',
  minFillToAssetAmount: '1',
  orderId: '8749ce1a-4ae3-4eb4-b2cf-baf4c236d9f3',
  orderType: 'LIMIT',
  status: 'OPEN',
  statusTransactionId: '1397f01a381407e19793bcc82ac237b314fcb228252bd53d3916eeda17b4ed25',
  toAsset: {
    assetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
    assetName: '',
    decimalPrecision: 6,
    enabled: true,
    iconUrl: '/cdn/ADA.png',
    longName: 'Cardano',
    policyId: '',
    referenceAssetAmount: '',
    referenceAssetId: '',
    shortName: 'ADA',
  },
  toAssetAmount: '173916910',
  toAssetAmountFilled: '0',
  toAssetAmountRemaining: '173916910',
  toAssetId: 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj',
  transactionFeeAmount: '355988',
  transactionTotalFeesAmount: '848769',
  transactions: [
    {
      transactionId: '14593b15-1a26-4748-a708-dd18a0e14d25',
      fromAssetAmountFilled: null,
      isTransactionConfirmed: true,
      toAssetAmountFilled: null,
      transactionDate: '2024-10-29T20:41:15.845Z',
      transactionHash: 'a917a61ef7d05555414e9e332f48afe577aaef9ac0b2fdeaf97a4300f9e657b2',
      transactionType: 'OPEN',
      transactionUrl:
        'https://cardanoscan.io/transaction/a917a61ef7d05555414e9e332f48afe577aaef9ac0b2fdeaf97a4300f9e657b2',
    },
    {
      transactionId: '228f3f2a-3e21-4535-8bd6-a7ec98610246',
      fromAssetAmountFilled: null,
      isTransactionConfirmed: true,
      toAssetAmountFilled: null,
      transactionDate: '2024-10-29T20:47:28.285Z',
      transactionHash: '1397f01a381407e19793bcc82ac237b314fcb228252bd53d3916eeda17b4ed25',
      transactionType: 'CANCEL',
      transactionUrl:
        'https://cardanoscan.io/transaction/1397f01a381407e19793bcc82ac237b314fcb228252bd53d3916eeda17b4ed25',
    },
  ],
  updated: '2024-10-29T20:47:28.343Z',
};
