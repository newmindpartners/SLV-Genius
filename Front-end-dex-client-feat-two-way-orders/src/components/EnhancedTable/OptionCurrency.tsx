import { styled, Typography } from '@mui/material';
import React, { FC } from 'react';

type OptionCurrencyType = {
  label: string;
  currencyLogo: string;
};

const OptionCurrency: FC<OptionCurrencyType> = ({ label, currencyLogo }) => (
  <CurrencyWrapper>
    <CurrencyLogo src={currencyLogo} />
    <CurrencyName>{label}</CurrencyName>
  </CurrencyWrapper>
);

const CurrencyWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const CurrencyName = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontSize: '18px',
  fontWeight: '400',
}));

const CurrencyLogo = styled('img')({
  display: 'flex',
  width: '28px',
  height: '28px',
});

export default OptionCurrency;
