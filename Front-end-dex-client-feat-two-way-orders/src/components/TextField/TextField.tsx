import {
  TextField as MuiTextField,
  TextFieldProps as MUITextFieldProps,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { forwardRef, useId } from 'react';

export type TextFieldColor = 'primary' | 'secondary';
export type TextFieldBgColor = 'primary' | 'secondary';

export interface CustomTextFieldProps {
  color?: TextFieldColor;
  bgcolor?: TextFieldBgColor;
  caption?: string;
}

export type TextFieldProps = Omit<MUITextFieldProps, 'color'> & CustomTextFieldProps;

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ color = 'primary', bgcolor = 'primary', caption, ...props }, ref) => {
    const id = useId();

    return (
      <Stack spacing={1} flex={1}>
        {caption && (
          <Typography
            variant="body2"
            color="chip.default.color"
            component="label"
            htmlFor={id}
          >
            {caption}
          </Typography>
        )}
        <TextFieldStyle
          $color={color}
          id={id}
          inputRef={ref}
          $bgcolor={bgcolor}
          {...props}
        />
      </Stack>
    );
  },
);

TextField.displayName = 'TextField';

const TextFieldStyle = styled(MuiTextField)<{
  $color: TextFieldColor;
  $bgcolor: TextFieldBgColor;
}>(({ theme, $color, $bgcolor }) => ({
  '& .Mui-error fieldset': {
    borderColor: `${theme.palette.error.main} !important`,
    borderWidth: '1px !important',
  },

  '& .MuiOutlinedInput-root': {
    borderRadius: theme.borderRadius.sm,

    background:
      $bgcolor === 'primary'
        ? theme.palette.bgPrimaryGradient.contrastText
        : theme.palette.bgCardColor.main,

    [`
      & .MuiOutlinedInput-notchedOutline,
      &:hover .MuiOutlinedInput-notchedOutline,
      & .Mui-disabled ~ .MuiOutlinedInput-notchedOutline
    `]: {
      borderColor:
        $bgcolor === 'primary'
          ? theme.palette.bgPrimaryGradient.contrastText
          : theme.palette.bgCardColor.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor:
        $color === 'primary' ? theme.palette.primary.main : theme.palette.chip.info.color,
    },
  },
  '& input.MuiOutlinedInput-input': {
    color: theme.palette.textColor.main,
  },
  '& label.Mui-focused': {
    color: theme.palette.soldOutColorStatus.main,
  },
}));

export default TextField;
