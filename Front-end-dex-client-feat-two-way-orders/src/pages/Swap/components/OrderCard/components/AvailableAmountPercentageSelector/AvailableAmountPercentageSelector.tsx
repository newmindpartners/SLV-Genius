import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { map } from 'lodash';
import { FC, useCallback, useEffect, useState } from 'react';
import { Asset } from '~/redux/api';
import { getUnitNumberFormatter } from '~/utils/math';

import PercentageButton from './PercentageButton';

export interface AvailableAmountPercentageSelectorProps {
  inputValue: string | null;

  fromAsset: Asset;
  fromAssetAmount: string;

  isDisabled: boolean;
}

export interface AvailableAmountPercentageSelectorCallbacks {
  onPercentageValueChange: (percentageValue: number | null) => void;
}

const percentageValues = [25, 50, 75, 100];

const AvailableAmountPercentageSelector: FC<
  AvailableAmountPercentageSelectorProps & AvailableAmountPercentageSelectorCallbacks
> = ({
  inputValue,

  fromAsset: { decimalPrecision: fromAssetDecimalPrecision },
  fromAssetAmount,

  isDisabled = false,

  onPercentageValueChange,
}) => {
  const numberFormatter = getUnitNumberFormatter(fromAssetDecimalPrecision);

  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);

  const handlePercentageButtonClick = useCallback(
    (percentage: number) => {
      setSelectedPercentage(percentage);
    },
    [selectedPercentage],
  );

  useEffect(() => {
    setSelectedPercentage(null);
  }, [inputValue]);

  useEffect(() => {
    onPercentageValueChange(selectedPercentage);
  }, [selectedPercentage]);

  return (
    <ControlsComposition container>
      {/* AvailableLabel */}
      <Grid item>
        <Typography
          variant="statusCard"
          color="buttonsInactive.main"
          fontFamily="secondaryFont"
        >
          {'Available: '}
        </Typography>
        <Typography
          variant="statusCard"
          fontFamily="secondaryFont"
          color="textColor.main"
        >
          {numberFormatter(fromAssetAmount)}
        </Typography>
      </Grid>

      {/* PercentagesSelector */}
      <PercentagesSelector item flexWrap={'wrap'} justifyContent={'flex-end'}>
        {map(percentageValues, (percentageValue) => {
          const isActive = percentageValue == selectedPercentage;

          return (
            <PercentageButton
              key={percentageValue}
              value={percentageValue}
              isActive={isActive}
              isDisabled={isDisabled}
              onClick={handlePercentageButtonClick}
            />
          );
        })}
      </PercentagesSelector>
    </ControlsComposition>
  );
};

const ControlsComposition = styled(Grid)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '5px',
    alignItems: 'flex-start',
  },
}));

const PercentagesSelector = styled(Grid)(({ theme }) => ({
  display: 'flex',
  gap: '5px',

  [theme.breakpoints.down('sm')]: {
    margin: '0 auto',
  },
}));

export default AvailableAmountPercentageSelector;
