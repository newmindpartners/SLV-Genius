import {inject, injectable, singleton} from 'tsyringe';
import * as Response from '~/domain/types/response';

import {TransactionalContext} from '~/domain/context';

import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';

import {CoreService} from '~/domain/services';
import {TransactionRepository} from '~/domain/repositories';

import {TransactionSubmitOrPostProcessHandler} from './transactionSubmitOrPostProcessHandler';

@singleton()
@injectable()
export class TransactionSubmitHandler
  implements
    TransactionSubmitOrPostProcessHandler<
      Public.SignedTransaction,
      Response.Response<Core.Transaction>
    >
{
  constructor(
    @inject('CoreService')
    private readonly coreService: CoreService,

    @inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository
  ) {}

  async handleTransaction(
    context: TransactionalContext,
    signedTransaction: Public.SignedTransaction
  ): Promise<Response.Response<Core.Transaction>> {
    const submittedTransaction = await this.transactionSubmit(
      signedTransaction
    );

    const savedSubmittedTransaction = Response.fold(
      async (error: Error) => {
        return Response.fromError(error);
      },
      async (submittedTransaction: Core.Transaction) => {
        return await this.saveSubmittedTransaction(
          context,
          submittedTransaction
        );
      }
    )(submittedTransaction);

    return savedSubmittedTransaction;
  }

  private async transactionSubmit(
    signedTransaction: Public.SignedTransaction
  ): Promise<Response.Response<Core.Transaction>> {
    const {transactionPayload, transactionSignature} = signedTransaction;

    try {
      const submittedTransaction = await this.coreService.transactionSubmit({
        transactionPayload,
        transactionSignature,
      });

      return Response.fromResult(submittedTransaction);
    } catch (e) {
      if (e instanceof Error) {
        return Response.fromError(e);
      } else {
        throw e;
      }
    }
  }

  private async saveSubmittedTransaction(
    context: TransactionalContext,
    submittedTransaction: Core.Transaction
  ): Promise<Response.Response<Core.Transaction>> {
    // TODO @luca There is a subtle but significant issue at hand: the transaction submit process is not
    //  transactional and does not implement ACID properties. As a result, if the submission succeeds but
    //  the saving of the submitted transaction fails, there will be an inconsistency between the blockchain
    //  and the saved information. It is crucial that we find a way to detect and handle these inconsistencies.
    //  One possible approach is to iterate over a list of errors in BullMQ and ensure that the database persistence
    //  remains consistent with the on-chain information.
    // @christofer: Perhaps we can add retry logic? And if that fails, report to Sentry or something.

    await this.transactionRepository.saveSubmittedTransaction(
      context,
      submittedTransaction
    );

    return Response.fromResult(submittedTransaction);
  }
}
