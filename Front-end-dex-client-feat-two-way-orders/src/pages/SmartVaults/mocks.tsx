import { Headline, RowWithSubrows } from '~/components/Table';

import CellWrapper from './components/CellWrapper/CellWrapper';
import { Strategy } from './components/StrategySelector';

export interface SmartVaultAsset {
  assetShortName: string;
  liquidity: string;
}

export interface SmartVaultData {
  assets: SmartVaultAsset[];
  strategy: string;
  tvl: {
    value: string;
    change: number;
  };
  created: string;
  apyBoost: number;
  rewards: {
    items: string[];
    percentage: number;
  };
}

export const smartVaultCardsData: SmartVaultData[] = [
  {
    assets: [
      {
        assetShortName: 'ADA',
        liquidity: '100',
      },
      {
        assetShortName: 'CRU',
        liquidity: '1350',
      },
      {
        assetShortName: 'CRU',
        liquidity: '50',
      },
      {
        assetShortName: 'ADA',
        liquidity: '350',
      },
    ],
    strategy: 'Investment Strategy No 1',
    tvl: {
      value: '$4.24b',
      change: 0.01,
    },
    created: '2023-01-01',
    apyBoost: 12.5,
    rewards: {
      items: ['58 GENS', '65 ADA', '1,000 BUSD'],
      percentage: 15.2,
    },
  },
  {
    assets: [
      {
        assetShortName: 'ADA',
        liquidity: '100',
      },
      {
        assetShortName: 'CRU',
        liquidity: '1350',
      },
      {
        assetShortName: 'CRU',
        liquidity: '1350',
      },
    ],
    strategy: 'Investment Strategy No 1',
    tvl: {
      value: '$4.24b',
      change: 0.01,
    },
    created: '2023-01-01',
    apyBoost: 12.5,
    rewards: {
      items: ['58 GENS', '65 ADA', '1,000 BUSD'],
      percentage: 15.2,
    },
  },
  {
    assets: [
      {
        assetShortName: 'ADA',
        liquidity: '100',
      },
      {
        assetShortName: 'CRU',
        liquidity: '1350',
      },
      {
        assetShortName: 'CRU',
        liquidity: '1350',
      },
    ],

    strategy: 'Investment Strategy No 1',
    tvl: {
      value: '$4.24b',
      change: 0.01,
    },
    created: '2023-01-01',
    apyBoost: 12.5,
    rewards: {
      items: ['58 GENS', '65 ADA', '1,000 BUSD'],
      percentage: 15.2,
    },
  },
  {
    assets: [
      {
        assetShortName: 'ADA',
        liquidity: '100',
      },
      {
        assetShortName: 'CRU',
        liquidity: '1350',
      },
      {
        assetShortName: 'CRU',
        liquidity: '1350',
      },
    ],
    strategy: 'Investment Strategy No 1',
    tvl: {
      value: '$4.24b',
      change: 0.01,
    },
    created: '2023-01-01',
    apyBoost: 12.5,
    rewards: {
      items: ['58 GENS', '65 ADA', '1,000 BUSD'],
      percentage: 15.2,
    },
  },
];

export const smartVaultTableHeadlines: Headline[] = [
  { content: 'Liquidity', align: 'left', sortKey: 'from' },
  { content: '', align: 'left' },
  { content: '', align: 'left' },
  { content: 'Strategy', align: 'left', sortKey: 'from' },
  { content: 'TVL', align: 'left', sortKey: 'from' },
  { content: 'Rewards', align: 'left', sortKey: 'from' },
];

export const mockFees = [
  {
    previewItem: {
      label: 'Total ADA Fee',
      value: '0',
      valueUnit: 'ADA',
    },
    collapsedItems: [
      {
        label: 'Application Fee',
        value: '0',
        valueUnit: 'ADA',
        tooltip:
          "A fee that covers the Genius Yield platform's operational costs. 20% of collected fees are returned to GENS stakers through the Profit Sharing functionality.",
      },
      {
        label: 'Transaction Fee',
        value: '0',
        valueUnit: 'ADA',
        tooltip:
          'A fee charged by Cardano blockchain to cover the costs of processing the trade and long-term storage of transactions.',
      },
    ],
  },
  {
    previewItem: {
      label: 'Deposit Amount',
      value: '0',
      valueUnit: 'ADA',
      tooltip:
        'Required deposit for partial fills. This amount will be returned to the user placing a limit order when the order is filled or cancelled.',
    },
  },
];

export const tableRowsSmartVault: RowWithSubrows[] = [
  {
    id: 1,
    cells: [
      {
        content: '120 ADA',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/ADA.png" />,
        align: 'left',
      },
      {
        content: '1,350 CRU',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/CRU.png" />,
        align: 'left',
      },
      {
        content: '1,350 CRU',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/CRU.png" />,
        align: 'left',
      },
      {
        content: 'Invsetment Strategy No 1',
        align: 'left',
      },
      { content: '$4.24b (+0.01%)', align: 'left' },
      { content: '58 GENS / 65 ADA / 1,000 BUSD', align: 'left' },
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
        content: '1,350 CRU',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/CRU.png" />,
        align: 'left',
      },
      {
        content: '1,350 CRU',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/CRU.png" />,
        align: 'left',
      },
      {
        content: 'Invsetment Strategy No 2',
        align: 'left',
      },
      { content: '$4.24b (+0.01%)', align: 'left' },
      { content: '58 GENS / 65 ADA / 1,000 BUSD', align: 'left' },
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
        content: '1,350 CRU',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/CRU.png" />,
        align: 'left',
      },
      {
        content: '1,350 CRU',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/CRU.png" />,
        align: 'left',
      },
      {
        content: 'Invsetment Strategy No 3',
        align: 'left',
      },
      { content: '$4.24b (+0.01%)', align: 'left' },
      { content: '58 GENS / 65 ADA / 1,000 BUSD', align: 'left' },
    ],
    subrows: [],
  },
  {
    id: 4,
    cells: [
      {
        content: '1,350 CRU',
        decorator: (content) => <CellWrapper data={content} avatar="/cdn/CRU.png" />,
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
        content: 'Invsetment Strategy No 4',
        align: 'left',
      },
      { content: '$4.24b (+0.01%)', align: 'left' },
      { content: '58 GENS / 65 ADA / 1,000 BUSD', align: 'left' },
    ],
    subrows: [],
  },
];

export const mockStrategies: Strategy[] = [
  {
    strategyLabel: 'Conservative',
    strategyValue: 'conservative',
  },
  {
    strategyLabel: 'Balanced',
    strategyValue: 'balanced',
  },
  {
    strategyLabel: 'Aggressive',
    strategyValue: 'aggressive',
  },
];
