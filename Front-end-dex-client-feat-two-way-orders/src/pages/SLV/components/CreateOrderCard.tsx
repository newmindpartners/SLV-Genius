import { Box, styled, Typography } from '@mui/material';
import { FC } from 'react';
import Button from '~/components/Button/Button';
import { Plus as PlusIcon } from '~/components/Icons/Plus';

interface CreateOrderCardProps {
  onCreateOrder: () => void;
}

const CreateOrderCard: FC<CreateOrderCardProps> = ({ onCreateOrder }) => {
  return (
    <CardWrapper>
      <CardContent>
        <IconWrapper>
          <PlusIcon />
        </IconWrapper>

        <Typography variant="h6" component="h2" gutterBottom>
          Create Two-Way Order
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create a new two-way order to provide liquidity to the DEX
        </Typography>

        <Button color="gradient" size="medium" onClick={onCreateOrder} fullWidth>
          Create Order
        </Button>
      </CardContent>
    </CardWrapper>
  );
};

const CardWrapper = styled(Box)(({ theme }) => ({
  background: theme.palette.bgCardRoundColor.main,
  borderRadius: theme.borderRadius.lg,
  padding: '32px 24px',
  minWidth: '280px',
  height: 'fit-content',
  border: `1px solid ${theme.palette.bgCardGray.main}`,

  [theme.breakpoints.down('md')]: {
    minWidth: '100%',
    padding: '24px 20px',
  },
}));

const CardContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: theme.palette.primary.main,
  marginBottom: '16px',

  '& svg': {
    width: '32px',
    height: '32px',
    color: theme.palette.common.white,
  },
}));

export default CreateOrderCard;
