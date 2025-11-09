import { Button, Grid, styled } from '@mui/material';
import { FC } from 'react';
import Alert from '~/components/Alert';

type AlternativeIdentification = {
  fromValue: string;
  toShortName: string;
};

type BetterAlternativeOrder =
  | AlternativeIdentification &
      (
        | {
            variant: 'BETTER_THAN_CURRENT';
            toValueDiscount: string;
          }
        | {
            variant: 'NO_CURRENT_EXIST';
          }
      );

type AlternativeOrderSectionProps = {
  betterAlternativeOrder: BetterAlternativeOrder;
  onSelectAlternativePrice: (toValue: string) => void;
};

const getMessage = (order: BetterAlternativeOrder) => {
  switch (order.variant) {
    case 'BETTER_THAN_CURRENT':
      return `An alternative order can give you an extra ${order.toValueDiscount} ${order.toShortName}`;
    case 'NO_CURRENT_EXIST':
      return 'No order found, but an alternative order is available';
  }
};

const AlternativeOrderSection: FC<AlternativeOrderSectionProps> = ({
  betterAlternativeOrder,
  onSelectAlternativePrice,
}) => {
  const onClickShowMe = () => {
    onSelectAlternativePrice(betterAlternativeOrder.fromValue);
  };

  return (
    <Container mt="20px">
      <ShowMeAlert
        severity="warning"
        action={<ShowMeButton onClick={onClickShowMe}>View</ShowMeButton>}
      >
        {getMessage(betterAlternativeOrder)}
      </ShowMeAlert>
    </Container>
  );
};

const Container = styled(Grid)({
  '& > .MuiPaper-root': {
    display: 'flex',
    alignItems: 'center',
  },
});

/**
 * Necessary to prevent Alert component from setting unwanted CSS such as `marginRight: -8px`
 */
const ShowMeAlert = styled(Alert)({
  '.MuiAlert-action': {
    padding: 'unset',
    margin: 'unset',
    marginLeft: '8px',
  },
});

const ShowMeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4C54F5',
  border: '1px solid transparent',
  borderRadius: '8px',
  width: 'fit-content',
  minWidth: '38px',
  height: '30px',
  textTransform: 'unset',

  '&:hover': {
    backgroundColor: '#4C54F5',
    border: `1px solid #4C54F5`,
    color: theme.palette.textColor.light,
    boxShadow: 'none',
  },

  '&:disabled': {
    backgroundColor: 'transparent',
  },

  '& > .MuiTypography-root': {
    color: theme.palette.textColor.main,
  },
}));

export default AlternativeOrderSection;
