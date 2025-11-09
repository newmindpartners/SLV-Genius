import { Tab as MuiTab, Tabs as MuiTabs, styled } from '@mui/material';
import { ReactElement } from 'react';
import { IOption } from '~/types/option';

export type TabSelectVariant = 'underline' | 'pill' | 'contained';

export interface TabSelectProps<T extends string | number> {
  value: T;
  options: IOption<T>[];
  variant?: TabSelectVariant;
  onChange: (value: T) => void;
}

export interface VariantProps {
  $variant: TabSelectVariant;
}

export const TabSelect = <T extends string | number>({
  value,
  options,
  variant = 'underline',
  onChange,
}: TabSelectProps<T>) => (
  <TabSelect.Wrapper
    $variant={variant}
    variant="standard"
    value={value}
    onChange={(_, value) => onChange(value)}
  >
    {options.map((option) => (
      <TabSelect.Tab
        key={option.value}
        $variant={variant}
        value={option.value}
        label={option.label}
        icon={option.icon as ReactElement}
        iconPosition={option.iconPosition}
      />
    ))}
  </TabSelect.Wrapper>
);

TabSelect.Tab = styled(MuiTab, {
  shouldForwardProp: (prop: string) => !prop.startsWith('$'),
})<VariantProps>(({ theme, $variant }) => ({
  ...($variant === 'underline' && {
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: theme.typography.h5.fontSize,
    paddingLeft: 0,
    paddingRight: 0,
    '&.Mui-selected': {
      color: '#ffffff',
    },
  }),
  ...($variant === 'pill' && {
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: theme.typography.body2.fontSize,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
    minWidth: 0,
    minHeight: theme.spacing(4),
    borderRadius: theme.borderRadius.sm,
    color: '#8d8d8d',
    '&.Mui-selected, &:hover': {
      backgroundColor: '#4C54F5',
      color: '#ffffff',
    },
  }),
  ...($variant === 'contained' && {
    zIndex: 1,
    textTransform: 'none',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '16px',
    letterSpacing: '0.6px',
    color: '#C1CEF1',
    minWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minHeight: theme.spacing(4),
    borderRadius: theme.borderRadius.sm,
    '&.Mui-selected': {
      color: theme.palette.textColor.main,
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  }),
}));

TabSelect.Wrapper = styled(MuiTabs, {
  shouldForwardProp: (prop: string) => !prop.startsWith('$'),
})<VariantProps>(({ theme, $variant }) => ({
  ...($variant === 'underline' && {
    '& .MuiTabs-flexContainer': {
      gap: theme.spacing(2),
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#4C54F5',
    },
  }),
  ...($variant === 'pill' && {
    minHeight: 0,
    '& .MuiTabs-flexContainer': {
      gap: theme.spacing(1),
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  }),
  ...($variant === 'contained' && {
    minHeight: 0,
    padding: '4px',
    background: '#171D2D',
    borderRadius: theme.borderRadius.sm,
    '& .MuiTabs-indicator': {
      height: '100%',
      background: '#4C54F5',
      borderRadius: '7px',
    },
  }),
}));
