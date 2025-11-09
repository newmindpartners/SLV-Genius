import {FastifyRequest} from 'fastify';
import {AuthorizationCheck, ContextInput} from '~/implementation/authorization';
import * as Public from '~/domain/models/public';
import {isEqual, uniq} from 'lodash';

type Body = Pick<Public.SmartVaultOpen, 'depositAssets'>;

const isExpectedBody = (
  req: FastifyRequest
): req is FastifyRequest<{
  Body: Body;
}> => (req as FastifyRequest<{Body: Body}>)?.body?.depositAssets !== undefined;

const hasDuplicates = (xs: string[]) => !isEqual(xs, uniq(xs));

const requestContextBuilder =
  (req: FastifyRequest) => async (context: ContextInput<object>) => {
    if (isExpectedBody(req)) {
      const assetIds = req.body.depositAssets.map(asset => asset.assetId);

      const isDepositAssetsUniqueList = !hasDuplicates(assetIds);

      return {...(await context), isDepositAssetsUniqueList};
    } else {
      throw Error('Stake vault id is not present in request');
    }
  };

export type DepositAssetsUniqueListContext = {
  isDepositAssetsUniqueList: boolean;
};

export const isDepositAssetsUniqueList: AuthorizationCheck<DepositAssetsUniqueListContext> =
  {
    errorCode: 'SMART_VAULT__OPEN__DEPOSIT_ASSETS_CONTAIN_DUPLICATES',
    predicate: context => context.isDepositAssetsUniqueList,
    requestContextBuilder: [requestContextBuilder],
  };
