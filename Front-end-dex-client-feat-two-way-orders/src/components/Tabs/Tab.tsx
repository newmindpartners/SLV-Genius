import { Tab as MUITab, tabClasses, TabProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

const Tab: FC<TabProps> = (props) => <TabStyled {...props} />;

const TabStyled = styled(MUITab)(({ theme }) => ({
  transition: '0.3s',
  color: theme.palette.textColor.main,

  [`&.${tabClasses.selected}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.textColor.main,
    borderRadius: theme.borderRadius.sm,
  },
}));

export default Tab;
