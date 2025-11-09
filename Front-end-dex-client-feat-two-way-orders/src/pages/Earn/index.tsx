import { CircularProgress, Collapse, Grid, styled, SxProps } from '@mui/material';
import * as Sentry from '@sentry/react';
import { FC, MouseEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Banner, { BannerProps } from '~/components/Banner/Banner';
import { useStakingUpdateDialog } from '~/context/stakingUpdateDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import {
  Asset,
  StakingProject,
  useListStakeVaultsQuery,
  useListStakingProjectNftsMutation,
  useListStakingProjectsQuery,
} from '~/redux/api';
import { LOCAL_STORAGE_KEYS } from '~/utils/constants';

import BannerFeatures from './components/BannerFeatures';
import NFTChecker from './components/NFTChecker';
import StakeDialog from './components/StakeDialog';
import StakeVaultsContent from './components/StakeVaultsContent';

type Reward = {
  asset: Asset;
  amount: string;
};

export type RewardsList = {
  rewards: Reward[];
};

export enum TabEnum {
  VaultStaking = 'vault-staking',
}
export type EarnTabs = {
  title: string;
  value: TabEnum;
};

const tabs = [
  {
    title: 'Vault Staking',
    value: TabEnum.VaultStaking,
  },
];

const Earn = (): JSX.Element => {
  const { isWalletConnected } = useWallet();
  const { assetId } = useParams();

  const collapseBanner = !isWalletConnected;

  return (
    <Grid direction="column" container>
      {/* if assetId is present in the URL the WalletConnectBanner 
        should not redirect to '/earn' after the user connects the wallet */}
      <WalletConnectBanner collapse={collapseBanner} />
      {isWalletConnected && <EarnContent urlAssetId={assetId} />}
    </Grid>
  );
};

type WalletConnectBannerProps = {
  collapse: boolean;
  sx?: SxProps;
  turnOffFeatures?: boolean;
};

export const WalletConnectBanner: FC<WalletConnectBannerProps> = ({
  collapse,
  turnOffFeatures,
  sx,
}): ReactElement => {
  const banner: BannerProps = {
    title: 'Connect a wallet and use all the features',
    buttonLabel: 'Connect Wallet',

    isCentered: true,
    isTextMediumSized: true,
    isConnectButtonMediumSized: true,
    hasHighlights: true,

    ...(!turnOffFeatures && {
      Features: BannerFeatures,
    }),

    id: 'gy-banner-connect-wallet-button',
  };

  return (
    <Collapse in={collapse} timeout={1000} sx={{ width: '100%' }}>
      <Grid item mb={{ xs: 7, sm: 5, md: 12 }} overflow={{ xs: 'hidden' }}>
        <Banner {...banner} sx={sx} />
      </Grid>
    </Collapse>
  );
};

type EarnContentProps = {
  urlAssetId: string | undefined;
};

const EarnContent: FC<EarnContentProps> = ({ urlAssetId }) => {
  const { getWalletBalance, walletStakeKeyHash } = useWallet();
  const { onDialogOpen } = useStakingUpdateDialog();

  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabs[0]?.value);
  const [stakeDialogOpen, setStakeDialogOpen] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  /**
   * Each Staking Project represents one asset we can create a Stake Vault in.
   * For MVP this will only be GENS
   */
  const stakingProjectsQuery = useListStakingProjectsQuery({});
  const projects: StakingProject[] = stakingProjectsQuery?.data?.results || [];

  /**
   * TODO: These should be filtered out by the API server, but we put this in
   * temporarily until that is done.
   */
  const NMKR_PROD_STAKING_PROJECT_ID = 'e6be15de-98a0-4155-af29-f80ed0c95761';
  const NTX_PROD_STAKING_PROJECT_ID = '5bbf2d9f-e58e-4cb0-8af4-13a8350cc2c5';
  const filteredProjects = projects.filter(
    ({ stakingProjectId }) =>
      ![NMKR_PROD_STAKING_PROJECT_ID, NTX_PROD_STAKING_PROJECT_ID].includes(
        stakingProjectId,
      ),
  );

  useEffect(() => {
    getWalletBalance().then(setWalletBalance);
  }, [walletStakeKeyHash]);

  /**
   * Fetch the list of NFTs that will be in the dropdown.
   * These are based on the assets that the user holds, and the NFTs that are seeded
   * for the project of this `stakingProjectId`.
   */

  const [getStakingNfts, stakingNftsResponse] = useListStakingProjectNftsMutation();

  const fetchStakingNfts = useCallback(() => {
    if (selectedProjectId && walletStakeKeyHash && walletBalance) {
      getStakingNfts({
        stakingProjectId: selectedProjectId,
        stakingProjectNftsRequest: {
          walletStakeKeyHash,
          walletBalance,
        },
      });
    }
  }, [selectedProjectId, walletStakeKeyHash, walletBalance]);

  useEffect(() => {
    fetchStakingNfts();
  }, [selectedProjectId, walletStakeKeyHash, walletBalance]);

  const walletStakingNfts = stakingNftsResponse?.data?.results || [];

  const stakeVaultResponse = useListStakeVaultsQuery({
    filterByWalletStakeKeyHash: walletStakeKeyHash,
  });

  const stakeVaults = stakeVaultResponse?.data?.results || [];

  const isLoadingStakeVaults = stakeVaultResponse.isLoading;
  const refetchStakeVaults = async () => {
    const res = await stakeVaultResponse.refetch();
    return res.data?.results || [];
  };

  const onChange = (_e: MouseEvent, value: TabEnum) => {
    if (!value || value === activeTab) return;
    setActiveTab(value);
  };

  useEffect(() => {
    if (
      localStorage.getItem(LOCAL_STORAGE_KEYS.STAKING_V2_LAUNCH_DIALOG_DISMISSED) !==
      'true'
    )
      onDialogOpen();
  }, []);

  if (isLoadingStakeVaults) {
    return (
      <Grid container justifyContent="center">
        <CircularProgress size={30} color="primary" />
      </Grid>
    );
  }

  const openStakeDialog = () => {
    setStakeDialogOpen(true);
  };

  const closeStakeDialog = () => {
    setSelectedProjectId(null);
    setStakeDialogOpen(false);
  };

  return (
    <Sentry.ErrorBoundary>
      <Container
        container
        gap="30px"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'center', md: 'flex-start' }}
        flexWrap="nowrap"
        maxWidth={{ sm: '90%' }}
        paddingBottom="30px"
        margin="0 auto"
      >
        <Grid item flex={1}>
          <NFTChecker urlAssetId={urlAssetId} />
          <StakeVaultsContent
            stakeVaults={stakeVaults}
            tabs={tabs}
            onChange={onChange}
            activeTab={activeTab}
            refetchStakeVaults={refetchStakeVaults}
            openDialog={openStakeDialog}
          />
        </Grid>
      </Container>

      {stakeDialogOpen && (
        <StakeDialog
          projects={filteredProjects}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          walletStakingNfts={walletStakingNfts}
          handleClose={closeStakeDialog}
          refetchStakeVaults={refetchStakeVaults}
          onCreateStakeVaultSuccess={fetchStakingNfts}
        />
      )}
    </Sentry.ErrorBoundary>
  );
};

const Container = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    alignItems: 'center',
    width: '95%',
    margin: '0 10px',
  },
}));

export default Earn;
