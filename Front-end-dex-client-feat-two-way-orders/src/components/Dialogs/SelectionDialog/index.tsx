import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';
import Heading from '~/components/Dialogs/SelectionDialog/Heading';
import { PopupCloseSvg } from '~/components/Icons/Icons';

import { Dialog } from '../Dialog';

type SelectionOption = {
  image: string;
  label: string;
  balance: string;
  id: string;
};

type SelectionDialogProps = {
  open: boolean;
  options: SelectionOption[];
  heading?: {
    title: string;
    subtitle?: string;
  };
  onSelectOption: (id: string) => void;
  onClose: () => void;
};

const SelectionDialog: FC<SelectionDialogProps> = ({
  options,
  open,
  heading,
  onSelectOption,
  onClose,
}) => (
  <DialogWrapper open={open} onClose={onClose}>
    <Grid container justifyContent={'flex-end'}>
      <CloseButton item onClick={onClose}>
        <PopupCloseSvg />
      </CloseButton>
    </Grid>
    <Grid container gap={{ xs: '79px', sm: '44px' }} direction="column">
      {heading && <Heading title={heading.title} subtitle={heading.subtitle} />}
      <Grid container direction="column" gap="6px" padding={{ xs: '0', md: '0 16px' }}>
        {options.map((option) => (
          <SelectionOptionItem
            key={`${option.id}-selection`}
            onSelectOption={onSelectOption}
            {...option}
          />
        ))}
      </Grid>
    </Grid>
  </DialogWrapper>
);

type SelectionOptionItemProps = {
  onSelectOption: (id: string) => void;
};

const SelectionOptionItem = ({
  id,
  label,
  onSelectOption,
  image,
  balance,
}: SelectionOption & SelectionOptionItemProps) => (
  <Item
    container
    alignItems="center"
    justifyContent="space-between"
    onClick={() => onSelectOption(id)}
  >
    <Typography
      variant="body3"
      component="h2"
      fontSize={{ xs: '15px', sm: '16px' }}
      lineHeight={{ xs: '24px', sm: '26px' }}
    >
      {label} <span>{balance}</span>
    </Typography>
    <Image src={image} alt={label} />
  </Item>
);

const DialogWrapper = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#202740',
    padding: '32px 32px 57px',
    width: '524px',
    [theme.breakpoints.down('sm')]: {
      padding: '16px 16px 110px',
      maxHeight: 'unset',
    },
  },
}));

const CloseButton = styled(Grid)(({ theme }) => ({
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    padding: '4px',
  },
}));

const Item = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.bgPrimaryGradient.contrastText,
  borderRadius: theme.borderRadius.sm,
  padding: '19px 36px 19px 40px',
  cursor: 'pointer',
  border: '1px solid transparent',
  '&:hover': {
    border: '1px solid',
    borderColor: '#4C54F5',
  },

  h2: {
    flex: '1',
    display: 'flex',
    paddingRight: '15px',
  },

  span: {
    marginLeft: '12px',
    opacity: 0.7,
  },

  [theme.breakpoints.down('sm')]: {
    padding: '16px 16px 16px 24px',
  },
}));

const Image = styled('img')(({ theme }) => ({
  width: '40px',
  height: '40px',
  [theme.breakpoints.down('sm')]: {
    width: '36px',
    height: '36px',
  },
}));

export default SelectionDialog;
