import Grid from '@mui/material/Grid';
import * as Sentry from '@sentry/react';
import { FC } from 'react';
import DateRangePicker, { DateRange } from '~/components/DateRangePicker/DateRangePicker';
import { AdvancedSettings } from '~/context/advancedSettingsContext';

import GreyDivider from './GreyDivider';
import Subtitle from './Subtitle';

type ContentProps = {
  settings: AdvancedSettings;
  setSettings: (settings: AdvancedSettings) => void;
};

const Content: FC<ContentProps> = ({ settings, setSettings }) => {
  const dateRange: DateRange = {
    startDate: settings.startDate,
    endDate: settings.endDate,
  };

  const setDateRange = (dateRange: DateRange) => {
    setSettings({
      ...settings,
      ...dateRange,
    });
  };

  return (
    <Sentry.ErrorBoundary>
      <Grid
        container
        marginTop="35px"
        width="400px"
        display="flex"
        gap="30px"
        maxWidth="100%"
      >
        <Subtitle subtitle="Time in Force" />

        <Grid width="100%" marginBottom="10px">
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            startDateTooltipContent={'Date when your order will be opened'}
            endDateTooltipContent={
              'Date until your order will be valid - until it gets completely filled or cancelled'
            }
          />
        </Grid>

        <GreyDivider />
      </Grid>
    </Sentry.ErrorBoundary>
  );
};

export default Content;
