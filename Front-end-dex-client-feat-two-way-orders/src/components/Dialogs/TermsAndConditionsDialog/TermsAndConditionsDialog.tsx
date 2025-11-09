import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { FC, ReactElement, useState } from 'react';
import Button from '~/components/Button/Button';
import { Dialog, DialogTitle } from '~/components/Dialogs/Dialog';
import DialogContent from '~/components/Dialogs/Dialog/DialogContent';
import CheckboxActive from '~/components/Icons/CheckboxActive';
import CheckboxIcon from '~/components/Icons/CheckboxIcon';

type ConfirmationAction = ({ disabled }: { disabled: boolean }) => React.ReactNode;

interface TermsCheckbox {
  checked: boolean;
  handleCheckedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  getConfirmationAction: ConfirmationAction;
}

interface ButtonsProps {
  checked: boolean;
  onClose: () => void;
  getConfirmationAction: ConfirmationAction;
}

export interface TermsAndConditionsDialogProps {
  open: boolean;
  termsUrl: string;
  heading?: React.ReactNode;
  getConfirmationAction?: ConfirmationAction;
  onClose: () => void;
}

const TermsAndConditionsDialog: FC<TermsAndConditionsDialogProps> = ({
  open,
  termsUrl,
  heading,
  getConfirmationAction,
  onClose,
}): ReactElement => {
  const [checked, setChecked] = useState(false);

  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Wrapper open={open} onClose={onClose}>
      <Grid container flexWrap={'nowrap'} direction={'column'}>
        <TitleWrapper item>
          <DialogTitle title={'Accept terms of use'} onClose={onClose} />
        </TitleWrapper>
        {heading}
        <Grid item>
          <DialogContent>
            <Grid container>
              <ContainerWrapper
                item
                maxHeight={'426px'}
                boxSizing={'border-box'}
                overflow={'hidden'}
                padding={{ xs: '25px 15px 25px 15px', md: '31px 15px 31px 15px' }}
              >
                <IframeStyled src={termsUrl} title="TCs" />
              </ContainerWrapper>
              {getConfirmationAction && (
                <TermsCheckbox
                  checked={checked}
                  getConfirmationAction={getConfirmationAction}
                  onClose={onClose}
                  handleCheckedChange={handleCheckedChange}
                />
              )}
            </Grid>
          </DialogContent>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

const TermsCheckbox: FC<TermsCheckbox> = ({
  checked,
  getConfirmationAction,
  onClose,
  handleCheckedChange,
}): ReactElement => (
  <Grid
    mt={{ xs: '20px', sm: '33px' }}
    direction={{ xs: 'column', sm: 'row' }}
    item
    container
    flexWrap={'nowrap'}
    alignItems={'center'}
  >
    <CheckboxWrapper item flexWrap={'nowrap'}>
      <FormControlStyled
        label={
          <Typography variant={'roundWrapperCardDesc'} color={'textColor.main'}>
            I have read and agree to the terms of use
          </Typography>
        }
        control={
          <CheckboxIcons
            checked={checked}
            onChange={handleCheckedChange}
            checkedIcon={<CheckboxActive />}
            icon={<CheckboxIcon />}
          />
        }
      />
    </CheckboxWrapper>
    <Buttons
      checked={checked}
      onClose={onClose}
      getConfirmationAction={getConfirmationAction}
    />
  </Grid>
);

const Buttons: FC<ButtonsProps> = ({
  checked,
  onClose,
  getConfirmationAction,
}): ReactElement => (
  <Grid
    flexWrap={'nowrap'}
    item
    container
    spacing={2}
    flex={1}
    width={'100%'}
    justifyContent={'center'}
  >
    <Grid item flex={1}>
      <Button color={'transparent'} size={'medium'} fullWidth onClick={onClose}>
        <Typography variant={'body3'}>Decline</Typography>
      </Button>
    </Grid>

    {getConfirmationAction({ disabled: !checked })}
  </Grid>
);

const Wrapper = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxHeight: 'none',
    margin: '0 70px',
    maxWidth: '715px',
    width: '95%',
    padding: '27.51px 33.5px',
    background: theme.palette.bgCardColor.main,
    borderRadius: theme.borderRadius.lg,
    '& .MuiDialogContent-root': {
      padding: 0,
    },
    [theme.breakpoints.down('md')]: {
      padding: '27.51px 37px',
      margin: '0 20px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '0',
      padding: '15px',
    },
  },
}));

const TitleWrapper = styled(Grid)(({ theme }) => ({
  '& h2': {
    [theme.breakpoints.down('md')]: {
      paddingBottom: '25px',
    },
  },
}));

const ContainerWrapper = styled(Grid)(({ theme }) => ({
  background: theme.palette.bgCardRoundColor.main,
  borderRadius: theme.borderRadius.lg,
  height: '416px',
  width: '100%',
}));

const IframeStyled = styled('iframe')(() => ({
  display: 'block',
  width: '100%',
  height: '100%',
  border: 'none',
}));

const FormControlStyled = styled(FormControlLabel)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    paddingBottom: '25px',
  },
}));

const CheckboxWrapper = styled(Grid)(({ theme }) => ({
  '& .MuiCheckbox-root': {
    marginRight: '7px',
  },

  [theme.breakpoints.down('lg')]: {
    width: '45%',
    paddingBottom: '25px',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const CheckboxIcons = styled(Checkbox)({
  marginLeft: '2px',
});

export default TermsAndConditionsDialog;
