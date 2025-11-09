import {
  Grid,
  List,
  ListItemButton,
  Avatar as MUIAvatar,
  styled,
  Typography,
  TypographyProps,
} from '@mui/material';
import { shouldForwardProp } from '@mui/system';
import { map } from 'lodash';
import { FC, ReactElement } from 'react';

import { SelectOption } from '../TextFieldIconSelect/TextFieldIconSelect';

export type DropdownOptionsProps = {
  selectedOption: SelectOption | null;
  displayedOptions: SelectOption[];
  handleOptionClick: (option: SelectOption) => () => void;
};

const DropdownOptions: FC<DropdownOptionsProps> = ({
  selectedOption,
  displayedOptions,
  handleOptionClick,
}): ReactElement => (
  <ListWrapper>
    {displayedOptions.length > 0 ? (
      map(displayedOptions, (option) => {
        const { id, label, icon, disabled, amount, symbol } = option;
        const isOptionSelected = Boolean(selectedOption && id === selectedOption.id);

        return (
          <ListItemButtonWrapper
            onClick={handleOptionClick(option)}
            key={id}
            selected={isOptionSelected}
            disableRipple
            // Custom prop to disable visually (setting a MUI disable opacity) for options that will change the opposite pair also
            isDisabledVisually={disabled}
          >
            <Grid
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              minHeight="47px"
            >
              <Grid display="flex" alignItems="center" gap="10px">
                <RoundIconWrapper>{icon && <Avatar src={icon} />}</RoundIconWrapper>

                <Grid display="flex" flexDirection="column">
                  <DescriptionText
                    textAlign="left"
                    variant="tabsOnProjectsPage"
                    lineHeight="22px"
                    fontWeight="600"
                  >
                    {label}
                  </DescriptionText>

                  {amount && (
                    <Grid display="flex" gap="5px" alignItems="center">
                      <DescriptionText>{amount}</DescriptionText>

                      <DescriptionText fontWeight="600">{symbol}</DescriptionText>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </ListItemButtonWrapper>
        );
      })
    ) : (
      <ListItemButton>No options found</ListItemButton>
    )}
  </ListWrapper>
);

const ListWrapper = styled(List)(({ theme }) => ({
  maxHeight: 298,
  overflow: 'auto',
  paddingTop: 0,

  '& > .MuiButtonBase-root': {
    padding: '5px 12px',
    minWidth: 300,
    margin: '2px 5px 2px 10px',
    borderRadius: theme.borderRadius.sm,
  },
}));

const ListItemButtonWrapper = styled(ListItemButton, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'isDisabledVisually',
})<{ isDisabledVisually?: boolean }>(({ isDisabledVisually }) => ({
  '&.Mui-selected': {
    backgroundColor: 'rgba(76, 84, 245, 0.4)',

    '&:hover': {
      backgroundColor: 'rgba(76, 84, 245, 0.4)',
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(76, 84, 245, 0.4)',
  },

  // Visually disabling (setting a MUI disable opacity) for options that will change the opposite pair also
  opacity: isDisabledVisually ? '0.4' : '1',
}));

const RoundIconWrapper = styled(Grid)(({ theme }) => ({
  width: '35px',
  height: '35px',
  backgroundColor: theme.palette.bgCardGray.main,
  borderRadius: '50%',
  overflow: 'hidden',

  '& img': {
    width: '100%',
    display: 'block',
  },
}));

const Avatar = styled(MUIAvatar)({
  width: '35px',
  height: '35px',
});

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

export default DropdownOptions;
