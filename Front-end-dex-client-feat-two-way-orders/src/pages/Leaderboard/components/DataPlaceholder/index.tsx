import { Stack, styled, Typography } from '@mui/material';
import { SearchIcon } from '~/components/Icons/SearchIcon';

export interface DataPlaceholderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const DataPlaceholder = ({ title, subtitle, children }: DataPlaceholderProps) => (
  <DataPlaceholder.Wrapper>
    <SearchIcon />
    <Stack spacing={1}>
      <Typography textAlign="center" variant="h5">
        {title}
      </Typography>
      {subtitle && (
        <Typography textAlign="center" variant="body1">
          {subtitle}
        </Typography>
      )}
    </Stack>
    {children}
  </DataPlaceholder.Wrapper>
);

DataPlaceholder.Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(8)};
`;
