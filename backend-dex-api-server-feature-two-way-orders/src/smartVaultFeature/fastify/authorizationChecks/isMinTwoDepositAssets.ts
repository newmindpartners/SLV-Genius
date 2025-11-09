import {FastifyRequest} from 'fastify';
import {AuthorizationCheck, ContextInput} from '~/implementation/authorization';
import * as Public from '~/domain/models/public';

type Body = Pick<Public.SmartVaultOpen, 'depositAssets'>;

const isExpectedBody = (
  req: FastifyRequest
): req is FastifyRequest<{
  Body: Body;
}> => (req as FastifyRequest<{Body: Body}>)?.body?.depositAssets !== undefined;

const requestContextBuilder =
  (req: FastifyRequest) => async (context: ContextInput<object>) => {
    if (isExpectedBody(req)) {
      const assetIds = req.body.depositAssets.map(asset => asset.assetId);

      const isMinTwoDepositAssets = assetIds.length >= 2;

      return {...(await context), isMinTwoDepositAssets};
    } else {
      throw Error('Stake vault id is not present in request');
    }
  };

export type DepositAssetsMinTwoContext = {
  isMinTwoDepositAssets: boolean;
};

export const isMinTwoDepositAssets: AuthorizationCheck<DepositAssetsMinTwoContext> =
  {
    errorCode: 'SMART_VAULT__OPEN__LESS_THAN_TWO_DEPOSIT_ASSETS',
    predicate: context => context.isMinTwoDepositAssets,
    requestContextBuilder: [requestContextBuilder],
  };
