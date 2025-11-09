import { Tabs as MUITabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FC, useState } from 'react';
import { a11yProps } from '~/utils/tabHelper';

import Tab from './Tab';
import TabPanel from './TabPanel';

export interface Props {
  tabsHeadings: {
    index: number;
    label: string;
  }[];
  tabs: {
    index: number;
    children: React.ReactElement;
  }[];
}

const Tabs: FC<Props> = ({ tabs, tabsHeadings }: Props) => {
  const [value, setActiveTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <TabsStyled value={value} onChange={handleChange} aria-label="basic tabs example">
        {tabsHeadings.map(({ label, index }) => (
          <Tab label={label} {...a11yProps(index)} key={`${index}-tab-heading`} />
        ))}
      </TabsStyled>

      {tabs.map(({ children, index }) => (
        <TabPanel value={value} index={index} key={`${index}-tab-panel`}>
          {children}
        </TabPanel>
      ))}
    </>
  );
};

const TabsStyled = styled(MUITabs)(() => ({
  '.MuiTabs-indicator': {
    display: 'none',
  },
}));

export default Tabs;
