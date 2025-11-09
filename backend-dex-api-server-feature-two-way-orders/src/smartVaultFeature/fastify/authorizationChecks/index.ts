import {DepositedAssetsContainAdaContext} from './isAdaInDepositAssets';
import {DepositedAssetsConnectedContext} from './isConnectedDepositAssets';
import {DepositAssetsUniqueListContext} from './isDepositAssetsUniqueList';
import {DepositAssetsMinTwoContext} from './isMinTwoDepositAssets';

export type SmartVaultContext = DepositedAssetsContainAdaContext &
  DepositedAssetsConnectedContext &
  DepositAssetsUniqueListContext &
  DepositAssetsMinTwoContext;
