import { Grid, styled, ToggleButton, Typography } from '@mui/material';
import { map } from 'lodash';
import { FC, MouseEvent, ReactElement } from 'react';
import Button from '~/components/Button/Button';
import { Plus } from '~/components/Icons/Icons';
import ToggleGroup from '~/components/Toggle/Toggle';
import { EarnTabs, TabEnum } from '~/pages/Earn';
import { EarnWidget } from '~/pages/Earn/components/EarnWidget';
import { StakeVault } from '~/redux/api';
import { useYieldFarmingListRewardsQuery } from '~/redux/api';

import YieldFarmingRewards from './YieldFarmingRewards';

const YIELD_FARMING_REWARDS_POLLING_INTERVAL = 60000;

type EarnContentProps = {
  tabs: EarnTabs[];
  onChange: (_e: MouseEvent, value: TabEnum) => void;
  activeTab: TabEnum;
  openDialog: () => void;
  stakeVaults: StakeVault[];
  refetchStakeVaults: () => void;
};

const StakeVaultsContent: FC<EarnContentProps> = ({
  tabs,
  onChange,
  activeTab,
  openDialog,
  stakeVaults,
  refetchStakeVaults,
}): ReactElement => {
  const yieldFarmingRewardsQuery = useYieldFarmingListRewardsQuery(
    {},
    { pollingInterval: YIELD_FARMING_REWARDS_POLLING_INTERVAL },
  );

  const rewardsClaimLovelaceServiceFee =
    yieldFarmingRewardsQuery.data?.rewardsClaimLovelaceServiceFee;

  const rewardsGroups = yieldFarmingRewardsQuery.data?.rewardsGroups?.map((group) => ({
    assets: group.assets,
    groupName: group.groupName,
  }));

  const isLoadingRewards = yieldFarmingRewardsQuery.isLoading;

  return (
    <>
      <EarnTitle item mt={2} xs={3} minWidth={12}>
        <Typography variant="h2">Earn</Typography>
      </EarnTitle>

      <ContentWrapper display="flex" gap="20px">
        <Grid flexGrow="1">
          <Grid
            container
            flexDirection={{ xs: 'row', sm: 'column' }}
            justifyContent="space-between"
          >
            <Grid container item mt={2} justifyContent="space-between" xs={8} md={12}>
              <Tabs
                tabs={map(tabs, ({ value, title }) => (
                  <ToggleButtonItem size={'small'} value={value} key={title}>
                    <Typography variant="tabsOnProjectsPage" fontSize="23px">
                      {title}
                    </Typography>
                  </ToggleButtonItem>
                ))}
                onChange={onChange}
                activeTab={activeTab}
              />
              {activeTab == TabEnum.VaultStaking && (
                <DesktopStaking item width="180px">
                  <NewStakingButton openDialog={openDialog} />
                </DesktopStaking>
              )}
            </Grid>
          </Grid>

          {activeTab == TabEnum.VaultStaking && (
            <MobileStaking item width="180px">
              <NewStakingButton openDialog={openDialog} />
            </MobileStaking>
          )}

          <Grid container columnSpacing={2} rowSpacing={2} mt={5}>
            <EarnWidget
              activeTab={activeTab}
              stakeVaults={stakeVaults}
              refetchStakeVaults={refetchStakeVaults}
              openStakeDialog={openDialog}
            />
          </Grid>
        </Grid>

        {activeTab === 'vault-staking' && (
          <Grid
            width={{ xs: '100%', sm: '320px' }}
            minWidth={{ xs: '100%', sm: '320px' }}
            mt="16px"
          >
            <YieldFarmingRewards
              rewardsGroups={rewardsGroups}
              rewardsClaimLovelaceServiceFee={rewardsClaimLovelaceServiceFee}
              isLoadingRewards={isLoadingRewards}
            />
          </Grid>
        )}
      </ContentWrapper>
    </>
  );
};

type NewStakingProps = {
  openDialog: () => void;
};

const NewStakingButton = ({ openDialog }: NewStakingProps) => (
  <StakeButton color="primary" size="medium" onClick={openDialog} startIcon={<Plus />}>
    <StakeText>New Staking Vault</StakeText>
  </StakeButton>
);

const ContentWrapper = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
  },
}));

const DesktopStaking = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    marginTop: 20,
  },

  [theme.breakpoints.down('sm')]: {
    display: 'none !important',
  },
}));

const MobileStaking = styled(Grid)(({ theme }) => ({
  marginTop: '20px',

  [theme.breakpoints.up('sm')]: {
    display: 'none !important',
  },
}));

const EarnTitle = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    h2: {
      fontSize: '28px',
    },
  },
}));

const Tabs = styled(ToggleGroup)(() => ({
  gap: '20px',
}));

const ToggleButtonItem = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.social.main,
  textTransform: 'none',
  border: 'none',
  padding: '0',
  borderRadius: '0',
  borderBottom: '3px solid transparent',

  '&:hover': {
    background: theme.palette.background.default,
  },

  '&.Mui-selected': {
    color: theme.palette.text.primary,
    background: theme.palette.background.default,
    borderBottom: '3px solid #4C54F5',

    '&:hover': {
      background: theme.palette.background.default,
    },
  },

  [theme.breakpoints.down('sm')]: {
    span: {
      fontSize: '14px',
      lineHeight: '30px',
    },
  },
}));

const StakeButton = styled(Button)({
  width: '100%',
  background: 'linear-gradient(90deg, #59EECA 0%, #59D3EE 100%)',
  borderRadius: '16px',
  padding: '14px 18px',

  '&:hover': {
    background: 'linear-gradient(90deg, #59EECA 0%, #59D3EE 100%)',
  },
});

const StakeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.background.default,
  fontSize: '14px',
}));

export default StakeVaultsContent;
