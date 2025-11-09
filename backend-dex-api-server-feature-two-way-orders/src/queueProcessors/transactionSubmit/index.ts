import 'reflect-metadata';

import {PrismaClient} from '@prisma/client';
import {Job, Worker} from 'bullmq';
import {container} from 'tsyringe';
import {TransactionApplication} from '~/application/transaction.application';
import * as Public from '~/domain/models/public';
import {ConfigService, LoggerService} from '~/domain/services';

import {
  configService as config,
  loggerService as logger,
  prismaClient as prisma,
} from '~/server.dependencyContext';

import {Command} from 'commander';
import {queueName} from './consts';
import {getRedisConfig} from '~/implementation/redis/redisClient';

type Options = {concurrency: number};
type Dependencies = {
  prisma: PrismaClient;
  config: ConfigService;
  logger: LoggerService;
  transactionApplication: TransactionApplication;
};
type SetupMQProcessorParams = {
  dependencies: Dependencies;
  options: Options;
};

async function setupMQProcessor({
  dependencies: {prisma, config, logger, transactionApplication},
  options: {concurrency},
}: SetupMQProcessorParams) {
  logger.info(`Queue worker {${queueName}} - starting`);

  logger.info(`Queue worker {${queueName}} - concurrency: ${concurrency}`);

  const worker = new Worker<Public.SignedTransaction, Public.Transaction>(
    queueName,
    async job => {
      logger.info(
        `Queue worker {${queueName}} - job: {${
          job.id
        }} started ${JSON.stringify(job.data)}`
      );

      const response = await prisma.$transaction(
        async prisma =>
          transactionApplication.submitTransaction(prisma, job.data),
        config.getPrismaTransactionOptions()
      );

      if (response instanceof Error) {
        throw response;
      } else {
        return response;
      }
    },
    {connection: getRedisConfig(config), concurrency: Number(concurrency)}
  );

  worker.on('failed', (job: Job, err) => {
    logger.error(
      err,
      `Queue worker {${queueName}} - Job: {${job.id}} has failed!`
    );
  });

  worker.on('stalled', (jobId: string) => {
    logger.info(
      `Queue worker {${queueName}} - Job: {${jobId}} has stalled, restarting!`
    );
  });

  worker.on('completed', (job: Job, returnvalue: Public.Transaction) => {
    logger.info(
      `Queue worker {${queueName}} - job: {${
        job.id
      }} complete: ${JSON.stringify(returnvalue)}`
    );
  });

  logger.info(`Queue worker {${queueName}} - started successfully`);
}

export const startProcessor = async (options: Options) => {
  const transactionApplication = container.resolve<TransactionApplication>(
    'TransactionApplication'
  );
  const dependencies = {prisma, config, logger, transactionApplication};
  await setupMQProcessor({dependencies, options});
};

new Command()
  .command('start')
  .option(
    '-c, --concurrency <concurrency>',
    'Specify the worker concurrency',
    '1'
  )
  .action(startProcessor)
  .parse();
