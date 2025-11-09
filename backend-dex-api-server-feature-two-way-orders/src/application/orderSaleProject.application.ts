import 'reflect-metadata';

import {flatMap, map, uniq} from 'lodash';

import {inject, injectable, singleton} from 'tsyringe';

import {ErrorCode} from '~/domain/errors';

import {TransactionalContext} from '~/domain/context';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {
  AssetRepository,
  CountryRepository,
  OrderSaleProjectRepository,
  OrderSaleRepository,
  WhitelistRepository,
} from '~/domain/repositories';

import {
  ConfigService,
  CoreService,
  LoggerService,
  OrderService,
  ProjectService,
} from '~/domain/services';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';

import * as fs from 'fs';
import {parse} from 'csv-parse';
import {
  getProjectRoundInProject,
  getProjectStatusRound,
} from '~/domain/utils/project.util';
import {walletStakeKeyBech32ToStakeKeyHash} from '~/domain/utils/wallet.util';
import {
  OrderSale,
  OrderSaleProjectCountryBlacklist,
} from '~/domain/models/private';

@singleton()
@injectable()
export class OrderSaleProjectApplication {
  constructor(
    @inject('OrderSaleProjectRepository')
    protected readonly orderSaleProjectRepository: OrderSaleProjectRepository,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('CoreService')
    private readonly coreService: CoreService,

    @inject('OrderService')
    private readonly orderService: OrderService,

    @inject('ProjectService')
    private readonly projectService: ProjectService,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('CountryRepository')
    private readonly countryRepository: CountryRepository,

    @inject('OrderSaleRepository')
    private readonly orderSaleRepository: OrderSaleRepository,

    @inject('WhitelistRepository')
    private readonly whitelistRepository: WhitelistRepository,

    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    @inject('ConfigService')
    private readonly configService: ConfigService
  ) {}

  async getUserOrderSaleProject(
    context: TransactionalContext,
    user: Private.User | null,
    projectId: string
  ): Promise<Public.OrderSaleProject> {
    const orderSaleProject =
      await this.orderSaleProjectRepository.getOrderSaleProjectByOrderSaleProjectId(
        context,
        projectId,
        user?.walletStakeKeyHash,
        true
      );

    if (!orderSaleProject) {
      throw new Error(ErrorCode.PROJECT_NOT_FOUND);
    }

    const orderSaleProjectCountryBlacklist =
      await this.countryRepository.getOrderSaleProjectCountryBlacklist(context);

    const annotatedOrderSaleProjectWithUserEligibility =
      await this.annotateOrderSaleProjectWithUserEligibility(
        context,
        user,
        orderSaleProject,
        orderSaleProjectCountryBlacklist
      );

    return annotatedOrderSaleProjectWithUserEligibility;
  }

  async listUserOrderSaleProjects(
    context: TransactionalContext,
    user: Private.User | null,
    query: Private.OrderSaleProjectQuery
  ): Promise<Private.PaginatedResults<Public.OrderSaleProject>> {
    const {results: orderSaleProjects, ...pagination} =
      await this.orderSaleProjectRepository.listOrderSaleProjects(
        context,
        query,
        user?.walletStakeKeyHash
      );

    const orderSaleProjectCountryBlacklist =
      await this.countryRepository.getOrderSaleProjectCountryBlacklist(context);

    const results = await Promise.all(
      orderSaleProjects.map(async orderSaleProject =>
        this.annotateOrderSaleProjectWithUserEligibility(
          context,
          user,
          orderSaleProject,
          orderSaleProjectCountryBlacklist
        )
      )
    );

    return {
      results,
      ...pagination,
    };
  }

  async updateProjectRound(
    context: TransactionalContext,
    roundId: string,
    orderSaleProjectRoundSetPrice: Private.OrderSaleProjectRoundSetPrice
  ): Promise<void> {
    const {orderSaleProject, orderSaleProjectRound} =
      await this.getOrderSaleProjectAndRoundByRoundId(context, roundId);

    const {
      priceUsd: actualRoundPriceUsd,
      priceLovelace: actualRoundPriceLovelace,
      scriptAddress: actualRoundScriptAddress,
    } = orderSaleProjectRound;

    // Early exit for local dev which runs set price on up
    if (
      actualRoundPriceUsd === orderSaleProjectRoundSetPrice.priceUsd &&
      actualRoundPriceLovelace === orderSaleProjectRoundSetPrice.priceLovelace
    ) {
      this.loggerService.warning(
        'Set project round price SKIPPED, attempted to set price to current values.'
      );
      return;
    }

    if (actualRoundPriceUsd) {
      throw new Error(ErrorCode.PROJECT_ROUND__PRICE_USD_ALREADY_DEFINED);
    }

    if (actualRoundPriceLovelace) {
      throw new Error(ErrorCode.PROJECT_ROUND__PRICE_LOVELACE_ALREADY_DEFINED);
    }

    if (actualRoundScriptAddress) {
      throw new Error(ErrorCode.PROJECT_ROUND__SCRIPT_ADDRESS_ALREADY_DEFINED);
    }

    const roundToValidateAndSave: Private.OrderSaleProjectRound = {
      ...orderSaleProjectRound,
      ...orderSaleProjectRoundSetPrice,
    };

    const adaAsset = await this.assetRepository.getAdaAsset(context);

    // Validate round parameters including input price values
    const request = this.orderService.toCoreOrderSaleGetScriptAddressRequest(
      orderSaleProject,
      roundToValidateAndSave,
      adaAsset
    );

    this.loggerService.info(
      `Round price request data: ${JSON.stringify(request)}`
    );

    const {scriptAddress: updateScriptAddress} =
      await this.coreService.orderSaleGetScriptAddress(request);

    this.loggerService.info(
      `Round price script address: ${updateScriptAddress}`
    );

    const setScriptAddress: Private.OrderSaleProjectRoundSetScriptAddress = {
      scriptAddress: updateScriptAddress,
    };

    await this.orderSaleProjectRepository.updateOrderSaleProjectRoundPriceAndScriptAddress(
      context,
      orderSaleProjectRound,
      orderSaleProjectRoundSetPrice,
      setScriptAddress
    );

    this.loggerService.info(
      `Round ${roundId}: priceLovelace set to ${orderSaleProjectRoundSetPrice.priceLovelace}, priceUsd set to ${orderSaleProjectRoundSetPrice.priceUsd}`
    );
  }

  async listPortfolioProjects(
    context: TransactionalContext,
    query: Private.OrderSalePortfolioQuery
  ): Promise<Private.PaginatedResults<Public.OrderSalePortfolioProject>> {
    const {filterByWalletStakeKeyHash: ownerWalletStakeKeyHash} = query;

    if (ownerWalletStakeKeyHash) {
      const portfolioProjects =
        await this.listPortfolioProjectsByOwnerWalletStakeKeyHash(
          context,
          ownerWalletStakeKeyHash
        );

      return Private.paginated(portfolioProjects, portfolioProjects.length);
    } else {
      return Private.emptyResults();
    }
  }

  private async listPortfolioProjectsByOwnerWalletStakeKeyHash(
    context: TransactionalContext,
    ownerWalletStakeKeyHash: string
  ): Promise<Public.OrderSalePortfolioProject[]> {
    const userProjects =
      await this.orderSaleRepository.allUserProjectsWithOrdersSaleAndSubmittedTransactionByOwnerWalletStakeKeyHash(
        context,
        ownerWalletStakeKeyHash
      );

    const adaAsset = await this.assetRepository.getAdaAsset(context);

    return this.domainMapper.toPublicPortfolioOrderSaleProjects(
      userProjects,
      adaAsset
    );
  }

  private async annotateOrderSaleProjectWithUserEligibility(
    context: TransactionalContext,
    user: Private.User | null,
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectCountryBlacklist: Private.OrderSaleProjectCountryBlacklist[]
  ): Promise<Public.OrderSaleProject> {
    const orderSaleProjectRoundStatus = getProjectStatusRound(orderSaleProject);

    const userOrdersSale = await this.getUserOrderSales(user, context);

    const adaAsset = await this.assetRepository.getAdaAsset(context);

    const publicOrderSaleProject =
      await this.domainMapper.toPublicOrderSaleProject(
        adaAsset,
        orderSaleProject
      );

    if (user && orderSaleProjectRoundStatus) {
      const {isBuyForbidden, isBuyForbiddenReason} =
        this.validateProjectUserEligibility(
          user,
          userOrdersSale,
          orderSaleProject,
          orderSaleProjectRoundStatus,
          orderSaleProjectCountryBlacklist
        );

      return {
        ...publicOrderSaleProject,

        isBuyForbidden,
        isBuyForbiddenReason,
      };
    } else {
      return publicOrderSaleProject;
    }
  }

  private async getUserOrderSales(
    user: Private.User | null,
    context: TransactionalContext
  ): Promise<Private.OrderSale[]> {
    const walletStakeKeyHash = user?.walletStakeKeyHash;

    const userProjects = walletStakeKeyHash
      ? await this.orderSaleRepository.allUserProjectsWithOrdersSaleAndSubmittedTransactionByOwnerWalletStakeKeyHash(
          context,
          walletStakeKeyHash
        )
      : [];

    return flatMap(userProjects, userProject =>
      flatMap(userProject.round, ({orderSale}) => orderSale)
    );
  }

  private validateProjectUserEligibility(
    user: Private.User,
    userOrdersSale: OrderSale[],
    orderSaleProject: Private.OrderSaleProject,
    orderSaleProjectRound: Private.OrderSaleProjectRound,
    orderSaleProjectCountryBlacklist: OrderSaleProjectCountryBlacklist[]
  ): {isBuyForbidden: boolean; isBuyForbiddenReason: string | undefined} {
    const validatedProject = this.projectService.validateUserProject(
      user,
      userOrdersSale,
      orderSaleProject,
      orderSaleProjectRound,
      orderSaleProjectCountryBlacklist
    );

    const {isAuthorized, errorCode: isBuyForbiddenReason} = validatedProject;

    const isBuyForbidden = !isAuthorized;

    return {
      isBuyForbidden,
      isBuyForbiddenReason,
    };
  }

  async replaceRoundWhitelist(
    context: TransactionalContext,
    roundId: string,
    {
      data,
      name,
    }: {
      data: Buffer;
      name: string;
    }
  ): Promise<boolean> {
    const stakeAddressList = await this.getListOfStakeAddressesFromInputCsv({
      data,
      name,
    });

    const walletStakeKeyHashList =
      await this.convertAListOfStringOrStakeAddressIntoAListOfWalletStakeKeyHashes(
        stakeAddressList
      );

    await this.whitelistRepository.createOrReplaceRoundWhitelist(
      context,
      roundId,
      walletStakeKeyHashList
    );

    return true;
  }

  private async getListOfStakeAddressesFromInputCsv({
    data,
    name,
  }: {
    data: Buffer;
    name: string;
  }): Promise<string[]> {
    // Write the contents of the file to a temporary file
    const tmpFile = `/tmp/${name}`;
    fs.writeFileSync(tmpFile, data);
    const stakeAddresses: string[] = [];
    await new Promise((resolve, reject) => {
      const tmpFile = `/tmp/${name}`;
      fs.createReadStream(tmpFile)
        .pipe(parse({columns: true}))
        .on('data', data => {
          const stakeAddress = data['stake_address'];

          if (stakeAddress) {
            stakeAddresses.push(stakeAddress);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Clean up the temporary file
    fs.unlinkSync(tmpFile);

    const uniqueStakeAddresses = uniq(stakeAddresses);

    return uniqueStakeAddresses;
  }

  private async convertAListOfStringOrStakeAddressIntoAListOfWalletStakeKeyHashes(
    stakeAddressList: string[]
  ): Promise<string[]> {
    const hexRegex = /^[A-F0-9]+$/i;
    const walletStakeKeyHashList: string[] = map(
      stakeAddressList,
      stakeAddress => {
        if (hexRegex.test(stakeAddress)) {
          return stakeAddress;
        } else {
          const stakeKeyHash = walletStakeKeyBech32ToStakeKeyHash(stakeAddress);
          if (stakeKeyHash === undefined) {
            throw new Error(`Failed to convert stake address: ${stakeAddress}`);
          }
          return stakeKeyHash;
        }
      }
    );
    return walletStakeKeyHashList;
  }

  protected async getOrderSaleProjectAndRoundByRoundId(
    context: TransactionalContext,
    roundId: string
  ): Promise<{
    orderSaleProject: Private.OrderSaleProject;
    orderSaleProjectRound: Private.OrderSaleProjectRound;
  }> {
    const orderSaleProject = await this.getOrderSaleProjectByRoundId(
      context,
      roundId
    );

    if (!orderSaleProject) {
      throw new Error(ErrorCode.PROJECT_NOT_FOUND);
    }

    const orderSaleProjectRound = getProjectRoundInProject(
      orderSaleProject,
      roundId
    );

    return {orderSaleProject, orderSaleProjectRound};
  }

  private async getOrderSaleProjectByRoundId(
    context: TransactionalContext,
    roundId: string,
    walletStakeKeyHash?: string
  ): Promise<Private.OrderSaleProject | null> {
    return await this.orderSaleProjectRepository.getOrderSaleProjectByRoundId(
      context,
      roundId,
      walletStakeKeyHash
    );
  }
}
