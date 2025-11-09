import { Grid, styled, Typography } from '@mui/material';
import { FC } from 'react';
import Avatar from '~/components/Avatar/Avatar';
import Chip from '~/components/Chip/Chip';
import { SmartVault } from '~/redux/api';
import { indivisibleToUnit } from '~/utils/mathUtils';

type CardHeaderProps = Pick<SmartVault, 'depositedAssets' | 'status'>;

const getChipType = (status: SmartVault['status']) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'OPEN':
      return 'success';
    case 'CLOSED':
      return 'default';
    case 'FAILED':
      return 'error';
    default:
      return 'info';
  }
};

const Header: FC<CardHeaderProps> = ({ depositedAssets, status }) => {
  return (
    <Wrapper>
      <Right container item>
        <Title>Locked Assets</Title>
        <List container>
          {depositedAssets.map((asset) => (
            <Item key={asset.assetId} container item>
              {/** TODO: How do we handle missing asset? */}
              <Logo variant="circle" src={asset.asset?.iconUrl || ''} />
              <Asset>
                {indivisibleToUnit(asset.assetAmount, asset.asset?.decimalPrecision || 6)}{' '}
                {asset.asset?.shortName}
              </Asset>
            </Item>
          ))}
        </List>
      </Right>

      <Chip label={status} type={getChipType(status)} variant="default" />
    </Wrapper>
  );
};

const Right = styled(Grid)(() => ({
  gap: 10,
}));

const Wrapper = styled(Grid)(() => ({
  display: 'flex',
  gap: 9,
}));

const Logo = styled(Avatar)(() => ({
  width: 30,
  height: 30,
}));

const Title = styled(Typography)(() => ({
  color: '#B9CAED',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '18px',
}));

const List = styled(Grid)(() => ({
  gap: 4,
}));

const Item = styled(Grid)(() => ({
  gap: 8,
  alignItems: 'center',
}));

const Asset = styled(Typography)(() => ({
  color: '#fff',
  fontWeight: 700,
  fontSize: '15px',
  lineHeight: '22px',
}));

export default Header;
