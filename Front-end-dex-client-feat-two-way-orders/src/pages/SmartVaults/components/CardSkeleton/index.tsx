import { Grid, styled } from '@mui/material';

import CardSkeleton from './components/CardSkeleton';

export interface CardsSkeletonProps {
  className?: string;
}

const SmartVaultsCardsSkeleton = ({ className }: CardsSkeletonProps) => (
  <Wrapper className={className}>
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </Wrapper>
);

const Wrapper = styled(Grid)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '100%',
});

export default SmartVaultsCardsSkeleton;
