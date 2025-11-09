import { ROUTES } from '~/components/AppLayout/config';
import { Headline, Row } from '~/components/Table';

export const dropMenuTitle: { [key: string]: string | undefined } = {
  [ROUTES.EXPLORE__MY_ORDERS]: 'My orders',
  [ROUTES.EXPLORE__DEX_ORDERS]: 'DEX Orders',
};

export const tableHeadlines: Headline[] = [
  { content: 'From', align: 'left', sortKey: 'from' },
  { content: 'To', align: 'left', sortKey: 'to' },
  { content: 'Price', align: 'left' },
  { content: 'Fee', align: 'left' },
  { content: 'Time', align: 'left', sortKey: 'time' },
  { content: 'Status', align: 'left' },
  { content: '', align: 'right' },
];

export const exploreToggleDefaultTab = { title: 'All', value: 'All' };

export const exploreToggle = [
  exploreToggleDefaultTab,
  { title: 'Open', value: 'Open' },
  { title: 'History', value: 'History' },
];

export const dropMenu = [
  {
    title: 'My Orders',
    link: ROUTES.EXPLORE__MY_ORDERS,
  },
  {
    title: 'DEX Orders',
    link: ROUTES.EXPLORE__DEX_ORDERS,
  },
];

export const tableRowsMyOrders: Row[] = [];
