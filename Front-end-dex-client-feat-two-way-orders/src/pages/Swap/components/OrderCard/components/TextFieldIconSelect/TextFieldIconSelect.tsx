import { CircularProgress, Grid, styled, TextField, Typography } from '@mui/material';
import { FC, ReactElement, ReactNode, useEffect, useRef } from 'react';

import IconSelectStartAdornment from './IconSelectStartAdornment';

export type SelectOption = {
  id: string;
  label: string;
  symbol: string;

  icon: string | null;
  amount: string | null;

  disabled?: boolean;
  iconBackgroundColor?: string;
};

type TradingPairFilteredOptions = {
  buy: SelectOption[];
  sell: SelectOption[];
};

export type TextFieldIconSelectProps = {
  title: string;
  endAdornment?: string;

  selectedOption: SelectOption | null;
  availableOptions: SelectOption[];

  textField: {
    value: string;
    loadingSpinner?: ReactNode;
    isLoading?: boolean;
    isDisabled?: boolean;

    onChange: (event: string) => void;
  };

  setSelectedOption: (option: SelectOption) => void;
  setFilteredOptions?: (value: React.SetStateAction<TradingPairFilteredOptions>) => void;
};

const TextFieldIconSelect: FC<TextFieldIconSelectProps> = ({
  textField: {
    value,
    onChange,
    isLoading = false,
    isDisabled = false,
    loadingSpinner = <DefaultInputLoader />,
  },
  title,
  endAdornment = null,

  selectedOption,
  availableOptions,

  setSelectedOption,
  setFilteredOptions,
}): ReactElement => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);

  useEffect(() => {
    if (setFilteredOptions) {
      setFilteredOptions((prev: TradingPairFilteredOptions) => {
        if (title === 'Buy') {
          return {
            ...prev,
            sell: prev.sell.filter(
              (item: SelectOption) => item.id !== selectedOption?.id,
            ),
          };
        } else {
          return {
            ...prev,
            buy: prev.buy.filter((item: SelectOption) => item.id !== selectedOption?.id),
          };
        }
      });
    }
  }, [selectedOption]);

  // Used to anchor the SearchableSelect dropdown to the TexField Wrapper to ensure consistent alignment with this component
  const textFieldWrapperRef = useRef(null);

  return (
    <TextFieldWrapper ref={textFieldWrapperRef}>
      <TextFieldRoundBorder
        value={value}
        disabled={isDisabled || isLoading}
        color="primary"
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <IconSelectStartAdornment
              title={title}
              availableOptions={availableOptions}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              textFieldWrapperRef={textFieldWrapperRef}
            />
          ),
          endAdornment: (
            <>
              <SecondaryTextField
                variant="poweredBy"
                color="buttonsInactive.main"
                fontFamily="secondaryFont"
              >
                {endAdornment}
              </SecondaryTextField>

              {isLoading && loadingSpinner}
            </>
          ),
        }}
      />
    </TextFieldWrapper>
  );
};

const DefaultInputLoader = () => (
  <CircularProgressWrapper>
    <CircularProgress color="primary" size={30} />
  </CircularProgressWrapper>
);

const TextFieldWrapper = styled(Grid)(() => ({
  position: 'relative',
  minWidth: '100%',

  '& > .MuiFormControl-root': {
    minWidth: '100%',

    '& > .MuiInputBase-root': {
      height: '61px',

      '& > .MuiInputBase-input': {
        fontSize: '18px',
        fontWeight: '500',
        textAlign: 'right',
      },
    },
  },
}));

const SecondaryTextField = styled(Typography)(() => ({
  position: 'absolute',
  right: '15px',
  top: '50px',
}));

const TextFieldRoundBorder = styled(TextField)(({ theme }) => ({
  '& > .MuiInputBase-root': {
    backgroundColor: theme.palette.bgPrimaryGradient.contrastText,
    padding: '40px 10px',
    borderRadius: theme.borderRadius.sm,

    '& > .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
    },

    '&:hover': {
      '& > .MuiOutlinedInput-notchedOutline': {
        borderColor: '#4C54F5',
      },
    },

    '&.Mui-focused': {
      '& > .MuiOutlinedInput-notchedOutline': {
        borderColor: '#4C54F5',
      },
    },

    '&.Mui-disabled': {
      '& > .MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent',
      },
    },
  },
}));

const CircularProgressWrapper = styled(Grid)({
  '& span': {
    display: 'block',
    margin: 'auto 0',
  },
});

export default TextFieldIconSelect;
