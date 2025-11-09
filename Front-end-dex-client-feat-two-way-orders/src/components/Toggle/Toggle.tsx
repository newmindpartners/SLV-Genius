import { ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';
import { FC, ReactElement } from 'react';

export interface Props {
  activeTab: string | null;
  tabs: ReactElement[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any;
}

const ToggleGroup: FC<Props & ToggleButtonGroupProps> = ({
  tabs,
  onChange,
  activeTab,
  ...props
}): ReactElement => (
  <ToggleButtonGroup
    color="primary"
    exclusive
    value={activeTab}
    onChange={onChange}
    {...props}
  >
    {tabs}
  </ToggleButtonGroup>
);

export default ToggleGroup;
