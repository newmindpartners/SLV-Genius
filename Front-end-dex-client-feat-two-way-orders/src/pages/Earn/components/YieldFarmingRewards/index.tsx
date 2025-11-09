import { CircularProgress, Grid, styled, ToggleButton, Typography } from '@mui/material';
import { isEmpty, map } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import ToggleGroup from '~/components/Toggle/Toggle';
import CustomGlobalStyles from '~/pages/Swap/CustomGlobalStyles';
import { YieldFarmingRewardAsset, YieldFarmingRewardsGroup } from '~/redux/api';

import Button from '../../../../components/Button/Button';
import AvailableRewards from './AvailableRewards';
import EmptyRewards from './EmptyRewards';
import PreviewClaimRewards from './PreviewClaimRewards';

export type YieldFarmingRewardsProps = {
  rewardsGroups?: YieldFarmingRewardsGroup[];
  rewardsClaimLovelaceServiceFee?: string;
  isLoadingRewards: boolean;
};

const YieldFarmingRewards: FC<YieldFarmingRewardsProps> = ({
  rewardsGroups,
  rewardsClaimLovelaceServiceFee,
  isLoadingRewards,
}) => {
  const [isOpenClaimRewardsDialog, setIsOpenClaimRewardsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleOpenRewardsDialog = () => setIsOpenClaimRewardsDialog(true);
  const handleCloseRewardsDialog = () => setIsOpenClaimRewardsDialog(false);

  const onChange = (_: unknown, value: string) => {
    if (!value || value === activeTab) return;
    setActiveTab(value);
  };

  const rewards = rewardsGroups?.reduce(
    (acc: YieldFarmingRewardAsset[], current) => [...acc, ...current.assets],
    [],
  );

  useEffect(() => {
    const defaultGroup = rewardsGroups?.[0];

    if (!defaultGroup) return;

    setActiveTab(defaultGroup?.groupName);
  }, [rewardsGroups?.length]);

  const tabs = rewardsGroups?.map((group) => ({
    title: group.groupName,
    value: group.groupName,
    rewards: group.assets,
  }));

  return (
    <Wrapper
      container
      flexDirection="column"
      gap="10px"
      padding="25px 25px 90px"
      position="relative"
      overflow="hidden"
    >
      <CustomGlobalStyles />
      <Highlight
        src={'/images/earnIllustrations/TopLeftHighlight.png'}
        alt={'PurpleHighlight'}
      />

      <Grid display="flex" flexDirection="column" textAlign="left" gap="10px" zIndex="2">
        <Typography variant="h4" fontWeight="800">
          My Rewards
        </Typography>
      </Grid>

      <Tabs
        tabs={map(tabs, ({ value, title }) => (
          <ToggleButtonItem size={'small'} value={value} key={title}>
            <Typography variant="tabsOnProjectsPage" fontSize="14px" lineHeight="30px">
              {title}
            </Typography>
          </ToggleButtonItem>
        ))}
        onChange={onChange}
        activeTab={activeTab}
      />

      {tabs?.map(
        (tab) =>
          tab.value === activeTab && (
            <>
              {isEmpty(tab.rewards) ? (
                <EmptyRewards />
              ) : (
                <AvailableRewards rewards={tab.rewards} />
              )}
            </>
          ),
      )}

      {isLoadingRewards ? (
        <Grid container item>
          <CircularProgress
            color="info"
            size={35}
            sx={{ margin: '20px auto', marginBottom: '0' }}
          />
        </Grid>
      ) : isEmpty(rewardsGroups) ? (
        <EmptyRewards />
      ) : (
        !isEmpty(rewards) && (
          <ClaimWrapper container>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disableRipple
              onClick={handleOpenRewardsDialog}
            >
              <Typography
                variant="description"
                fontWeight="700"
                color="bgPrimaryGradient.contrastText"
              >
                {`Claim  (${rewards?.length})`}
              </Typography>
            </Button>
          </ClaimWrapper>
        )
      )}

      {isOpenClaimRewardsDialog && (
        <PreviewClaimRewards
          rewardsClaimLovelaceServiceFee={rewardsClaimLovelaceServiceFee}
          rewards={rewards}
          onClose={handleCloseRewardsDialog}
        />
      )}
    </Wrapper>
  );
};

const darkGrayColor = 'rgba(26, 54, 204, 0.2)';

const Tabs = styled(ToggleGroup)(() => ({
  gap: '20px',
}));

const ToggleButtonItem = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.social.main,
  textTransform: 'none',
  border: 'none',
  borderRadius: '0',
  backgroundColor: 'transparent',
  borderBottom: '3px solid transparent',
  padding: '0',

  '&:hover': {
    backgroundColor: 'transparent',
  },

  '&.Mui-selected': {
    color: theme.palette.text.primary,
    borderBottom: '3px solid #4C54F5',
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: 'transparent',
    },
  },

  [theme.breakpoints.down('sm')]: {
    span: {
      fontSize: '14px',
    },
  },
}));
const Wrapper = styled(Grid)(({ theme }) => ({
  background: `linear-gradient(to top right, ${darkGrayColor} 0%, #000000 20%, ${darkGrayColor} 100%)`,
  color: theme.palette.textColor.main,
  borderRadius: theme.borderRadius.sm,
  border: '1px solid #323F62',
}));

const Highlight = styled('img')(() => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  transform: 'translateY(-50%)',
  width: '100%',
  height: '100%',
}));

const ClaimWrapper = styled(Grid)(({ theme }) => ({
  background: theme.palette.bgPrimaryGradient.contrastText,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '15px 30px',
  justifyContent: 'flex-end',

  '& > .MuiButtonBase-root': {
    '&:active, &:hover': {
      boxShadow: `0 0px 4px ${theme.palette.primary.main}`,
    },
  },
}));

export default YieldFarmingRewards;
