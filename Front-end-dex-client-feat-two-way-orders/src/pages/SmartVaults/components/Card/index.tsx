import { Grid, styled } from '@mui/material';
import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SmartVault } from '~/redux/api';

import Actions from './Actions';
import Content from './Content';
import Header from './Header';

type Props = SmartVault & {
  handleWithdrawClick: (e: React.MouseEvent) => void;
  handleDepositClick: (e: React.MouseEvent) => void;
  smartVaultId: string;
};

const SmartVaultCard: FC<Props> = ({
  created,
  depositedAssets,
  smartVaultStrategy,
  smartVaultId,
  status,
  handleWithdrawClick,
  handleDepositClick,
}) => {
  const navigate = useNavigate();

  const handleViewSmartVault = useCallback((smartVaultId: string) => {
    navigate(`/smart-vaults/${smartVaultId}`);
    window.scrollTo(0, 0);
  }, []);

  return (
    <Card container direction="column" onClick={() => handleViewSmartVault(smartVaultId)}>
      <Header depositedAssets={depositedAssets} status={status} />

      <Content created={created} smartVaultStrategy={smartVaultStrategy} />

      <Actions
        handleWithdrawClick={handleWithdrawClick}
        handleDepositClick={handleDepositClick}
      />
    </Card>
  );
};

const Card = styled(Grid)({
  padding: '22px',
  backgroundColor: '#202740',
  borderRadius: '29px',
  backgroundImage: 'none',
  cursor: 'pointer',
});

export default SmartVaultCard;
