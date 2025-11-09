import { GridView, List } from '@mui/icons-material';
import { IOption } from '~/types/option';

import { TradingWalletsView } from '../types/TradingWalletsView';

export const tradingWalletsViewOptions: IOption<TradingWalletsView>[] = [
  {
    icon: <List />,
    iconPosition: 'start',
    label: 'Table view',
    value: TradingWalletsView.Table,
  },
  {
    icon: <GridView />,
    iconPosition: 'start',
    label: 'Card view',
    value: TradingWalletsView.Cards,
  },
];

export const botsDataTooltip = 'ROI and Earned are representative of the last 3 months';
