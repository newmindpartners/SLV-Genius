import 'reflect-metadata';
import {inject, injectable, singleton} from 'tsyringe';
import {CardanoNetwork} from '~/domain/models/cardano';
import {ConfigService} from '~/domain/services';

import * as AssetVesting from './stakingAssetVesting';
import * as StakingNftMintingData from './stakingNftMintingData';
import {Projects, projects} from './stakingNftMintingData/types';

const isCardanoNetwork = (network: string): network is CardanoNetwork =>
  Object.keys(CardanoNetwork).includes(network);

const isProject = (projectName: unknown): projectName is Projects => {
  if (
    typeof projectName === 'string' &&
    (projects as string[]).includes(projectName)
  ) {
    return true;
  } else {
    console.warn(
      `Provided projectName ${projectName} is not part of ${projects}`
    );
    return false;
  }
};

@singleton()
@injectable()
export class CliToolsApplication {
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService
  ) {}

  stakingAssetVestingSql(parameters: AssetVesting.Parameters) {
    return AssetVesting.stakingAssetVestingSql(parameters);
  }

  generateStakingNftMintingDataSql(
    parameters: StakingNftMintingData.GenerateSqlParameters
  ) {
    return StakingNftMintingData.generateStakingNftMintingDataSql(parameters);
  }

  async parseBlockfrostForNftMintingData({
    network,
    projectName,
    outputFile,
  }: {
    network: string;
    projectName: string;
    outputFile: string;
  }) {
    if (isProject(projectName) && isCardanoNetwork(network)) {
      const blockfrostAccessToken =
        this.configService.getBlockfrostAccessToken(network);

      const parameters = {
        network,
        projectName,
        outputFile,
        blockfrostAccessToken,
      };

      await StakingNftMintingData.parseBlockfrostForNftMintingData(parameters);
    } else {
      throw new Error('Invalid arguments');
    }
  }
}
