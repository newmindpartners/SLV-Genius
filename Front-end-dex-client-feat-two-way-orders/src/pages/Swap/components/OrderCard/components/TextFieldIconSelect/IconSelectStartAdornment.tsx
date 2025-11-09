import TollIcon from '@mui/icons-material/Toll';
import {
  Grid,
  InputAdornment,
  Avatar as MUIAvatar,
  styled,
  Typography,
} from '@mui/material';
import { FC, ReactElement } from 'react';

import SearchableSelect, { CenteredDescriptionText } from './SearchableSelect';
import { SelectOption } from './TextFieldIconSelect';

export type IconSelectStartAdornmentProps = {
  title: string;
  selectedOption: SelectOption | null;
  availableOptions: SelectOption[];
  setSelectedOption: (option: SelectOption) => void;
  textFieldWrapperRef: React.MutableRefObject<null>;
};

const IconSelectStartAdornment: FC<IconSelectStartAdornmentProps> = ({
  title,
  selectedOption,
  setSelectedOption,
  availableOptions,
  textFieldWrapperRef,
}): ReactElement => {
  const icon = selectedOption?.icon;

  return (
    <InputAdornment position="start">
      <Grid display="flex" flexDirection="row" gap="4px" position="relative">
        <IconWrapper>
          {icon ? (
            <Avatar src={icon} alt={selectedOption.label} />
          ) : (
            // Used mainly in case the user has the token "X" in an select and he selects the token "X" again in another dropdown
            <DefaultIconWrapper
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="100%"
              borderRadius="50%"
            >
              <TollIcon color="primary" />
            </DefaultIconWrapper>
          )}
        </IconWrapper>

        <Grid
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          alignItems="flex-start"
          width="min-content"
          position="absolute"
          left="58px"
          top="-8px"
          gap="2px"
        >
          <Typography
            variant="statusCard"
            color="buttonsInactive.main"
            align="left"
            fontWeight="400"
            fontSize="13px"
          >
            {`${title}:`}
          </Typography>

          <TextColumn>
            <SelectOrMessage
              selectedOption={selectedOption}
              availableOptions={availableOptions}
              setSelectedOption={setSelectedOption}
              textFieldWrapperRef={textFieldWrapperRef}
            />
          </TextColumn>
        </Grid>
      </Grid>
    </InputAdornment>
  );
};

const SelectOrMessage = ({
  availableOptions,
  selectedOption,
  setSelectedOption,
  textFieldWrapperRef,
}: {
  selectedOption: SelectOption | null;
  availableOptions: SelectOption[];
  setSelectedOption: (option: SelectOption) => void;
  textFieldWrapperRef: React.MutableRefObject<null>;
}): JSX.Element => {
  if (availableOptions.length === 0) {
    return (
      <CenteredDescriptionText fontWeight="700">
        {'No options available'}
      </CenteredDescriptionText>
    );
  }

  if (availableOptions.length === 1) {
    return (
      <CenteredDescriptionText fontWeight="700">
        {availableOptions[0].label}
      </CenteredDescriptionText>
    );
  }

  return (
    <SearchableSelect
      availableOptions={availableOptions}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      textFieldWrapperRef={textFieldWrapperRef}
    />
  );
};

const Avatar = styled(MUIAvatar)({
  width: '45px',
  height: '45px',
});

const IconWrapper = styled(Grid)(() => ({
  width: '45px',
  height: '45px',
  borderRadius: '7px',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '& > img': {
    width: '100%',
    display: 'block',
  },
}));

const TextColumn = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  minWidth: 'min-content',

  '& > .MuiTypography-root': {
    textAlign: 'left',
  },

  // select
  '& > .MuiInputBase-root': {
    backgroundColor: theme.palette.bgPrimaryGradient.contrastText,
    height: '25px',

    // default option
    '& > .MuiSelect-select': {
      margin: 0,
      // important needed because specificity couldn't be bypassed
      padding: '0 !important',
      width: 'fit-content',

      '& > li': {
        padding: 0,
      },

      '& > li:hover': {
        backgroundColor: 'transparent',
      },
    },

    // select arrow
    '& > svg': {
      marginTop: '4px',
    },

    '& > fieldset': {
      border: 0,
    },
  },
}));

const DefaultIconWrapper = styled(Grid)(() => ({
  backgroundColor: '#4C54F5',
}));

export default IconSelectStartAdornment;
