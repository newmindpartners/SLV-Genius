import { Grid, styled, Tab, Tabs } from '@mui/material';
import React, { FC, SyntheticEvent } from 'react';
import { OrderCardOrderType } from '~/context/advancedSettingsContext';

export type OrderCardMarketTabsProps = {
  value: OrderCardOrderType;
  onChange: (event: SyntheticEvent, newValue: OrderCardOrderType) => void;
};

const OrderCardMarketTabs: FC<OrderCardMarketTabsProps> = ({ value, onChange }) => {
  return (
    <MarketTabsWrapper>
      <StyledTabs value={value} onChange={onChange}>
        <StyledTab value="limit" label="Limit" />
        <StyledTab value="bestAvailable" label="Market" />
      </StyledTabs>
    </MarketTabsWrapper>
  );
};

const StyledTabs = styled(Tabs)({
  minHeight: '0px',

  '& .MuiTabs-indicator': {
    height: '100%',
    background: '#4C54F5',
    borderRadius: '7px',
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.MuiTab-root': {
    width: '50%',

    textTransform: 'none',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '16px',
    letterSpacing: '0.6px',
    color: '#C1CEF1',
    padding: '8px 12px',
    minWidth: '0px',
    minHeight: '0px',
    borderRadius: '7px',
    zIndex: '1',
  },

  '&.Mui-selected': {
    color: theme.palette.textColor.main,
  },
}));

const MarketTabsWrapper = styled(Grid)(({ theme }) => ({
  width: '100%',
  padding: '4px',
  background: '#171D2D',
  marginBottom: '16px',
  borderRadius: theme.borderRadius.sm,
}));

export default OrderCardMarketTabs;
