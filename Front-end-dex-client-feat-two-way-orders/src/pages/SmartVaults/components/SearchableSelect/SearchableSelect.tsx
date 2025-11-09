import { Grid, Avatar as MUIAvatar, Popover, styled, TextField } from '@mui/material';
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
import { CenteredDescriptionText } from '~/pages/Swap/components/OrderCard/components/TextFieldIconSelect/DropdownOptions';
import { SearchableSelectProps } from '~/pages/Swap/components/OrderCard/components/TextFieldIconSelect/SearchableSelect';
import { SelectOption } from '~/pages/Swap/components/OrderCard/components/TextFieldIconSelect/TextFieldIconSelect';

import SmartVaultDropdownOptions from '../DropdownOptions/DropdownOptions';

const containsText = (text: string, searchText: string): boolean =>
  includes(toLower(text), toLower(searchText));

const SmartVaultSearchableSelect: FC<
  SearchableSelectProps & { isActive?: boolean; handleChangeActive: () => void }
> = ({
  availableOptions,
  selectedOption,
  setSelectedOption,
  textFieldWrapperRef,
  isActive,
  handleChangeActive,
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
    handleChangeActive();
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
      <div ref={textFieldWrapperRef}>
        <SelectedOptionWrapper
          ref={inputRef}
          onClick={handleInputClick}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="6px 12px 14px 6px"
          position="relative"
        >
          <Grid display="flex" flexDirection="row" alignItems="center" gap="12px">
            <IconWrapper>
              {selectedOption?.icon && <Avatar src={selectedOption.icon} />}
            </IconWrapper>
            <Grid display="flex" flexDirection="row" alignItems="center" gap="6px">
              <CenteredDescriptionText fontWeight="700">
                {selectedOption?.symbol || 'Select an option'}
              </CenteredDescriptionText>
              <DownArrow />
            </Grid>

            {isActive && <SelectLine />}
          </Grid>
        </SelectedOptionWrapper>
      </div>

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
          />
        </Grid>

        <SmartVaultDropdownOptions
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
    // top: "0 !important",
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

const IconWrapper = styled(Grid)(({ theme }) => ({
  width: '28px',
  height: '28px',
  backgroundColor: theme.palette.bgCardGray.main,
  borderRadius: '8px',
  overflow: 'hidden',

  '& img': {
    width: '100%',
    display: 'block',
  },
}));

const Avatar = styled(MUIAvatar)({
  width: '28px',
  height: '28px',
  borderRadius: '8px',
});

const SelectLine = styled(Grid)({
  display: 'flex',
  position: 'absolute',
  height: '4px',
  bottom: 0,
  left: 0,
  width: '100%',
  zIndex: '2',
  backgroundColor: '#4C54F5',
  borderRadius: '8px',
});

export default SmartVaultSearchableSelect;
