import { styled } from '@mui/material';
import { FC, useMemo } from 'react';

import Chip, { CustomChipProps } from '../Chip/Chip';

type OptionStatusType = {
  startDate: Date;
  endDate: Date;
};

const OptionStatus: FC<OptionStatusType> = ({ startDate, endDate }) => {
  const status: {
    label: string;
    type: CustomChipProps['type'];
  } = useMemo(() => {
    if (new Date() > new Date(endDate)) {
      return {
        label: 'Expired',
        type: 'error',
      };
    }

    if (new Date(endDate) > new Date(startDate)) {
      return {
        label: 'Active',
        type: 'success',
      };
    }

    if (new Date() < new Date(startDate)) {
      return {
        label: 'Not Started',
        type: 'default',
      };
    }

    return {
      label: 'In Progress',
      type: 'success',
    };
  }, [endDate, startDate]);
  return (
    <StatusWrapper>
      <Chip label={status.label} type={status.type} variant="default" />
    </StatusWrapper>
  );
};

const StatusWrapper = styled('div')({});

export default OptionStatus;
