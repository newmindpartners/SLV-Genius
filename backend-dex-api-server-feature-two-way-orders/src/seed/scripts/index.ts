import 'reflect-metadata';

import * as Prisma from '@prisma/client';
import {Command} from 'commander';
import {CardanoNetwork} from '~/domain/models/cardano';
import {ConfigServiceNode} from '~/implementation/node/config.service';
import {SeedProjects} from '../types';
import {runSeed as _runCommonGroupSeed} from './commonGroup';
import {runSeed as _runProjectGroupSeed} from './projectGroup';
import {runSeed as _runOrderSaleGroupSeed} from './orderSaleGroup';
import {runSeed as _runStakingGroupSeed} from './stakingGroup';
import {runSeed as _runDevStakeVaultsSeed} from './devStakeVaults';
import {runSeed as _runTradingPairsSeed} from './tradingPairGroup';
import {runSeed as _runDevUserSeed} from './devUser';
import {runSeed as _runDevOrderSwaps} from './devOrderSwaps';
import {purgeAllTables} from './purge';

const config = new ConfigServiceNode();

const prisma = new Prisma.PrismaClient(config.getPrismaClientOptions());

const validateNetwork = (network: string): network is CardanoNetwork => {
  const cardanoNetworks = Object.keys(CardanoNetwork);

  return cardanoNetworks.includes(network);
};

const validateProject = (project: string): project is SeedProjects => {
  const projects = Object.keys(SeedProjects);

  return projects.includes(project);
};

const program = new Command();

program.command('help').action(() =>
  console.log(
    `Available commands:

- commonGroup --network <network>
- projectGroup --network <network> --project-name <projectName>
- orderSaleGroup --network <network> --project-name <projectName>
- stakingGroup --network <network> --project-name <projectName>

where 'network' is MAINNET, PREVIEW or PREPROD
and 'project-name' is 'GENS', 'CRU' or one of the other supported projects.
`
  )
);

// yarn seed commonGroup --network MAINNET
// yarn seed commonGroup --network PREPROD
program
  .command('commonGroup')
  .requiredOption('--network <network>')
  .action(({network}) => {
    if (validateNetwork(network)) {
      return _runCommonGroupSeed(prisma, config, network);
    } else {
      throw new Error(`Invalid network flag ${network} passed`);
    }
  });

// yarn seed projectGroup --network MAINNET --project-name GENS
// yarn seed projectGroup --network PREPROD --project-name GENS
program
  .command('projectGroup')
  .requiredOption('--network <network>')
  .requiredOption('--project-name <projectName>')
  .action(({network, projectName}) => {
    if (validateNetwork(network) && validateProject(projectName)) {
      return _runProjectGroupSeed(prisma, config, network, projectName);
    } else {
      throw new Error(
        `Invalid project-name ${projectName} or network ${network} flag passed`
      );
    }
  });

// yarn seed orderSaleGroup --network MAINNET --project-name GENS
// yarn seed orderSaleGroup --network PREPROD --project-name GENS
program
  .command('orderSaleGroup')
  .requiredOption('--network <network>')
  .requiredOption('--project-name <projectName>')
  .action(({network, projectName}) => {
    if (validateNetwork(network) && validateProject(projectName)) {
      return _runOrderSaleGroupSeed(prisma, config, network, projectName);
    } else {
      throw new Error(
        `Invalid project-name ${projectName} or network ${network} flag passed`
      );
    }
  });

// yarn seed stakingGroup --network MAINNET --project-name GENS
// yarn seed stakingGroup --network PREPROD --project-name GENS
program
  .command('stakingGroup')
  .requiredOption('--network <network>')
  .requiredOption('--project-name <projectName>')
  .action(({network, projectName}) => {
    if (validateNetwork(network) && validateProject(projectName)) {
      return _runStakingGroupSeed(prisma, config, network, projectName);
    } else {
      throw new Error(
        `Invalid project-name ${projectName} or network ${network} flag passed`
      );
    }
  });

// yarn seed devStakeVaults --network MAINNET --project-name GENS
program
  .command('devStakeVaults')
  .requiredOption('--network <network>')
  .requiredOption('--project-name <projectName>')
  .action(({network, projectName}) => {
    if (validateNetwork(network) && validateProject(projectName)) {
      return _runDevStakeVaultsSeed(prisma, config, network, projectName);
    } else {
      throw new Error(
        `Invalid project-name ${projectName} or network ${network} flag passed`
      );
    }
  });

// yarn seed tradingPairGroup --network MAINNET --trading-pair-symbol examplePool
// yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol examplePool
program
  .command('tradingPairGroup')
  .requiredOption('--network <network>')
  .requiredOption('--trading-pair-symbol <tradingPairSymbol>')
  .action(({network, tradingPairSymbol}) => {
    if (validateNetwork(network)) {
      return _runTradingPairsSeed(prisma, config, network, tradingPairSymbol);
    } else {
      throw new Error(`Invalid network flag ${network} passed`);
    }
  });

// yarn seed devUser
program.command('devUser').action(() => _runDevUserSeed(prisma, config));

// yarn seed devOrderSwaps
program
  .command('devOrderSwaps')
  .action(() => _runDevOrderSwaps(prisma, config));

// yarn seed purge
program.command('purge').action(() => purgeAllTables(prisma));

program.parse();
