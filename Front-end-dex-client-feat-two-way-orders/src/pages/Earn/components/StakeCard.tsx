import { Grid, styled, Typography } from '@mui/material';
import { FC, ReactElement } from 'react';
import { AddCardButton } from '~/components/Icons/AddCardButton';

type StakeCardProps = {
  openDialog: () => void;
  description: string;
  cardTitle: string;
  tooltip?: string;
  disabled?: boolean;
};

const StakeCard: FC<StakeCardProps> = ({
  disabled = false,
  cardTitle,
  openDialog,
}): ReactElement => (
  <Wrapper
    container
    gap={{ xs: '20px', sm: '62px' }}
    justifyContent="flex-start"
    disabled={disabled}
  >
    <CardWrapper
      container
      p="15px"
      width={{ xs: '100%', sm: '360px' }}
      height="261px"
      maxWidth="100%"
      borderRadius="20px"
    >
      <AddIconWrapper
        direction="column"
        container
        height="100%"
        width="100%"
        border="1px dashed #7787B1"
        borderRadius="20px"
        gap="22px"
        justifyContent="center"
        alignItems="center"
        disabled={disabled}
        onClick={!disabled ? openDialog : undefined}
      >
        <AddCardButton />
        <Typography fontWeight="700" fontSize="16px" lineHeight="27px">
          {cardTitle}
        </Typography>
      </AddIconWrapper>
    </CardWrapper>
  </Wrapper>
);

const AddIconWrapper = styled(Grid)(({ disabled }: { disabled?: boolean }) => ({
  cursor: disabled ? 'not-allowed' : 'pointer',
}));

const CardWrapper = styled(Grid)(() => ({
  backgroundColor: '#202740',
}));

const Wrapper = styled(Grid)(({ disabled }: { disabled?: boolean }) => ({
  opacity: disabled ? 0.4 : 1,
}));

export default StakeCard;
