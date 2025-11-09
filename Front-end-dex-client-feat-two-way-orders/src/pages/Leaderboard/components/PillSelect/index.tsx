import { styled, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { IOption } from '~/types/option';

export interface PillSelectProps<T extends string | number> {
  value: T;
  options: IOption<T>[];
  onChange: (value: T) => void;
}

export const PillSelect = <T extends string | number>({
  value,
  options,
  onChange,
}: PillSelectProps<T>) => {
  return (
    <PillSelect.Wrapper
      exclusive
      value={value}
      onChange={(_, value) => value !== null && onChange(value)}
    >
      {options.map((option) => (
        <PillSelect.Pill key={option.value} value={option.value}>
          {option.label}
        </PillSelect.Pill>
      ))}
    </PillSelect.Wrapper>
  );
};

PillSelect.Pill = styled(ToggleButton)`
  border-radius: ${({ theme }) => `${theme.borderRadius.sm} !important`};
  border: none;
  min-height: 2rem;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: ${({ theme }) => theme.spacing(1.5)};
  padding-right: ${({ theme }) => theme.spacing(1.5)};
  text-transform: none;
  background-color: none;
  color: white;

  &:hover,
  &.Mui-selected {
    background-color: ${({ theme }) => theme.palette.chip.info.color} !important;
  }
`;

PillSelect.Wrapper = styled(ToggleButtonGroup)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;
