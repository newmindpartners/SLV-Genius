import { Avatar, Grid, styled, Typography } from '@mui/material';
import { FC } from 'react';

type LabelProps = {
  label: string;
  color?: string;
  fontWeight?: 'normal' | 'bold' | string;
};

type CurrencyLabelProps = {
  content: string;

  value?: string;
  icon?: string;
};

const StyledTypography: FC<LabelProps> = ({ label, color, fontWeight = 'normal' }) => (
  <Typography
    variant="roundWrapperCardDesc"
    lineHeight="20px"
    color={color}
    fontWeight={fontWeight}
  >
    {label}
  </Typography>
);

export const Label: FC<LabelProps> = (props) => <StyledTypography {...props} />;

const MainLabel: FC<LabelProps> = (props) => (
  <StyledTypography fontWeight="700" {...props} />
);

const CurrencyLabel: FC<CurrencyLabelProps> = ({ icon, content, value }) => (
  <Grid container gap="10px" alignItems="center" wrap="nowrap">
    {icon && <IconWrapper src={icon} alt={`${value} icon`} />}
    <Grid display="flex" gap="5px">
      <MainLabel label={content} />
      {value && <Label label={value} />}
    </Grid>
  </Grid>
);

const IconWrapper = styled(Avatar)({
  width: '28px',
  height: '28px',

  '& > img': {
    width: '28px',
  },
});

export default CurrencyLabel;
