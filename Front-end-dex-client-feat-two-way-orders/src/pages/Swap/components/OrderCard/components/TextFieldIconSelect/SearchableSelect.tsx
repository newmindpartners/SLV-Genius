import {
  Grid,
  Popover,
  styled,
  TextField,
  Typography,
  TypographyProps,
} from '@mui/material';
import { filter, includes, toLower } from 'lodash';
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import DownArrow from '~/components/Icons/DownArrow';
import SearchSVG from '~/components/Icons/SearchSVG';

import { SelectOption } from '../TextFieldIconSelect/TextFieldIconSelect';
import DropdownOptions from './DropdownOptions';

const containsText = (text: string, searchText: string): boolean =>
  includes(toLower(text), toLower(searchText));

export type SearchableSelectProps = {
  availableOptions: SelectOption[];
  selectedOption: SelectOption | null;
  setSelectedOption: (option: SelectOption) => void;
  textFieldWrapperRef: React.MutableRefObject<null>;
};

const SearchableSelect: FC<SearchableSelectProps> = ({
  availableOptions,
  selectedOption,
  setSelectedOption,
  textFieldWrapperRef,
}): ReactElement => {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
  };

  const handleSearchTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // Used to trim whitespace from the search text - if the user inputs 'GENS ' the search does not display anything
      const singleWordRegex = /^\s*\w+\s*$/;
      const inputValue = singleWordRegex.test(event.target.value)
        ? event.target.value.trim()
        : event.target.value;

      setSearchText(inputValue);
    },
    [],
  );

  const displayedOptions: SelectOption[] = useMemo(
    () => filter(availableOptions, ({ label }) => containsText(label, searchText)),
    [availableOptions, searchText],
  );

  const handleOptionClick = useCallback(
    (option: SelectOption) => () => {
      setSelectedOption(option);
      handleClose();
    },
    [setSelectedOption],
  );

  const id = isOpen ? 'searchable-select-popover' : '';

  return (
    <Grid>
      <SelectedOptionWrapper
        ref={inputRef}
        onClick={handleInputClick}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="5px"
      >
        <CenteredDescriptionText fontWeight="700">
          {selectedOption?.symbol || 'Select an option'}
        </CenteredDescriptionText>
        <DownArrow />
      </SelectedOptionWrapper>

      <PopoverWrapper
        id={id}
        open={isOpen}
        onClose={handleClose}
        // Anchors the element to the TextFieldIconSelect's wrapper
        anchorEl={textFieldWrapperRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Grid display="flex" flexDirection="row" alignItems="center" padding="5px 16px 0">
          <Grid display="flex" justifyContent="center" alignContent="center" width="35px">
            <SearchSVG />
          </Grid>
          <TextFieldWrapper
            fullWidth
            placeholder="Type Token Name..."
            value={searchText}
            onChange={handleSearchTextChange}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </Grid>

        <DropdownOptions
          selectedOption={selectedOption}
          displayedOptions={displayedOptions}
          handleOptionClick={handleOptionClick}
        />
      </PopoverWrapper>
    </Grid>
  );
};

const SelectedOptionWrapper = styled(Grid)({
  cursor: 'pointer',
});

const PopoverWrapper = styled(Popover)(({ theme }) => ({
  top: 5,

  '& > .MuiPaper-root': {
    backgroundColor: '#172239',
    backgroundImage: 'none',
    border: '1px solid #28304E',
    borderRadius: theme.borderRadius.sm,
  },
}));

const TextFieldWrapper = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    // Remove default border
    '& fieldset': {
      borderColor: 'transparent',
      borderWidth: 0,
    },

    // Remove hover border
    '&:hover fieldset': {
      borderColor: 'transparent',
    },

    // Remove focus border
    '&.Mui-focused fieldset': {
      borderColor: 'transparent',
      borderWidth: 0,
    },

    '& > .MuiOutlinedInput-input': {
      padding: '14px 10px',
      color: theme.palette.buttonsInactive.dark,
      fontWeight: 500,
      fontSize: '15px',
      lineHeight: '16px',
    },
  },

  // Additional styles to ensure no border is shown at any state
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

export const DescriptionText: FC<TypographyProps> = ({ children, ...props }) => (
  <Typography
    variant="description"
    align="center"
    fontFamily="secondaryFont"
    color="textColor"
    {...props}
  >
    {children}
  </Typography>
);

export const CenteredDescriptionText: FC<TypographyProps> = ({ children, ...props }) => (
  <DescriptionText align="center" {...props}>
    {children}
  </DescriptionText>
);

export default SearchableSelect;
