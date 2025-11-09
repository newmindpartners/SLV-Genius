import 'reflect-metadata';

import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import * as stakingUtil from '~/domain/utils/staking.util';

import {
  AssetRepository,
  StakeVaultRepository,
  StakingNftRepository,
  StakingProjectRepository,
} from '~/domain/repositories';

import {ConfigService} from '~/domain/services';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';

import {getAssetsFromWalletBalance} from '~/domain/utils/wallet.util';

@singleton()
@injectable()
export class StakingProjectApplication {
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('StakingProjectRepository')
    private readonly stakingProjectRepository: StakingProjectRepository,

    @inject('StakeVaultRepository')
    private readonly stakeVaultRepository: StakeVaultRepository,

    @inject('StakingNftRepository')
    private readonly stakingNftRepository: StakingNftRepository
  ) {}

  async listStakingProjects(
    context: TransactionalContext,
    query: Private.StakingProjectsQuery
  ): Promise<Private.PaginatedResults<Public.StakingProject>> {
    const stakingProjects =
      await this.stakingProjectRepository.listStakingProjects(context, query);

    const results: Public.StakingProject[] = stakingProjects;

    const count = results.length;

    const response: Private.PaginatedResults<Public.StakingProject> = {
      count,
      results,
    };

    return response;
  }

  async listStakingProjectNfts(
    context: TransactionalContext,
    stakingProjectId: string,
    walletBalance: string
  ): Promise<Private.PaginatedResults<Public.StakingNft>> {
    const projectStakingNfts: Private.StakingNft[] =
      await this.stakingProjectRepository.listStakingProjectNfts(
        context,
        stakingProjectId
      );

    const walletPolicyIdAssetsList = getAssetsFromWalletBalance(walletBalance);

    /**
     * We look at the assets that the wallet holds (`walletBalance`) and cross reference
     * these with the NFTs that are allowed to be staked in this Staking Project.
     *
     * We return these NFTs back to the user to choose from when creating a Stake Vault.
     */
    const walletStakingNfts: Public.StakingNft[] =
      await projectStakingNfts.reduce(async (allStakingNftsP, stakingNft) => {
        const allStakingNfts = await allStakingNftsP;
        const mintingData: Private.StakingNftMintingData[] =
          await this.stakingNftRepository.getStakingNftMintingDataByTypeAndSubType(
            context,
            stakingNft.type,
            stakingNft.subType
          );

        const newStakingNfts: Public.StakingNft[] =
          this.getStakingNftsForWallet(
            stakingNft,
            walletPolicyIdAssetsList,
            mintingData
          );

        return [...allStakingNfts, ...newStakingNfts];
      }, Promise.resolve<Public.StakingNft[]>([]));

    const filteredWalletStakingNfts = walletStakingNfts.filter(
      stakingNft => !stakingUtil.isVestingNft(stakingNft.type)
    );

    const results: Public.StakingNft[] = filteredWalletStakingNfts;

    const count = results.length;

    const response: Private.PaginatedResults<Public.StakingNft> = {
      count,
      results,
    };

    return response;
  }

  private getStakingNftsForWallet(
    stakingNft: Private.StakingNft,
    walletPolicyIdAssetsList: ReturnType<typeof getAssetsFromWalletBalance>,
    mintingData: Private.StakingNftMintingData[]
  ): Public.StakingNft[] {
    const policyIdsForStakingNft = mintingData.map(x => x.policyId);

    const walletAssetsList = walletPolicyIdAssetsList.filter(policyIdAssets =>
      policyIdsForStakingNft.includes(policyIdAssets.policyId)
    );

    /**
     * `assetName` is HEX case insensitive so to avoid one source using uppercase and
     * another lowercase, we just convert them all to lowercase as that seems to be
     * the default (CIP-30 getBalance for example, and all explorers).
     */
    const newStakingNfts: Public.StakingNft[] = walletAssetsList.flatMap(
      ({policyId: walletPolicyId, assets}) => {
        const mintingDataForPolicyId = mintingData
          .filter(({policyId}) => policyId === walletPolicyId)
          .map(data => ({
            ...data,
            assetName: data.assetName.toLowerCase(),
          }));

        const assetNamesForPolicyId = mintingDataForPolicyId.map(
          ({assetName}) => assetName
        );

        const stakingNfts: (Public.StakingNft | null)[] = assets
          .filter(({amount}) => amount === 1)
          .filter(({assetName}) =>
            assetNamesForPolicyId.includes(assetName.toLowerCase())
          )
          .map(asset => {
            const mintingDataForAssetList = mintingDataForPolicyId.filter(
              ({assetName}) => assetName === asset.assetName
            );
            const mintingDataForAsset: Private.StakingNftMintingData | null =
              mintingDataForAssetList[0];

            const publicStakingNft: Public.StakingNft | null =
              mintingDataForAsset
                ? this.domainMapper.toPublicStakingNft(
                    stakingNft,
                    {
                      ...mintingDataForAsset,
                      assetName: mintingDataForAsset.assetName.toLowerCase(),
                    },
                    /**
                     * We don't have to care about this since we filter out vesting
                     * NFTs anyway.
                     */
                    null
                  )
                : null;

            return publicStakingNft;
          });

        return stakingNfts.filter(
          stakingNft => stakingNft !== null
        ) as Public.StakingNft[];
      }
    );

    return newStakingNfts;
  }
}
