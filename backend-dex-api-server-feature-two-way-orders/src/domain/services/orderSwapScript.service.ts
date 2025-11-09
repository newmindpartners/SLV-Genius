import {inject, injectable, singleton} from 'tsyringe';
import {ConfigService} from './config.service';

type OrderSwapVersionConfig = {
  orderSwapNftPolicyIds: string[];
  orderSwapScriptAddresses: string[];
};

type OrderSwapEnvConfig = {
  [version: string]: OrderSwapVersionConfig;
};

const ORDER_SCRIPT_VERSION = 'POCVersion1_1';

const orderSwapConfigs: Record<string, OrderSwapEnvConfig> = {
  MAINNET: {
    V1: {
      orderSwapNftPolicyIds: [
        '22f6999d4effc0ade05f6e1a70b702c65d6b3cdf0e301e4a8267f585',
        '642c1f7bf79ca48c0f97239fcb2f3b42b92f2548184ab394e1e1e503',
      ],
      orderSwapScriptAddresses: [
        'addr1w8kllanr6dlut7t480zzytsd52l7pz4y3kcgxlfvx2ddavcshakwd',
        'addr1wx5d0l6u7nq3wfcz3qmjlxkgu889kav2u9d8s5wyzes6frqktgru2',
      ],
    },
  },
  PREPROD: {
    V1: {
      orderSwapNftPolicyIds: [
        '158f42b49e0841301b45358b87744167f43359cc3785eab8d30893e1',
        '53827a77e4ed3d5c211706708c0aa9b9a3be19db901b1cbf7fa515b8',
      ],
      orderSwapScriptAddresses: [
        'addr_test1wret5erdzvt4n5gukyzxyj3hplx2rnxan5d6wqvxradjlzsvzusk3',
        'addr_test1wpzrw6jlvv6zp9ay7gzqzzyvvtdzwf3eucryf20vr4c0g3qqsx5pq',
      ],
    },
  },
};

export interface OrderSwapScriptService {
  getCurrentCoreOrderScriptVersion(): string;

  getOrderSwapScriptPolicyIds(orderSwapScriptVersion: string): string[];

  getOrderSwapScriptAddresses(orderSwapScriptVersion: string): string[];
}

@singleton()
@injectable()
export class OrderSwapScriptServiceImplementation
  implements OrderSwapScriptService
{
  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService
  ) {}

  getCurrentCoreOrderScriptVersion(): string {
    return ORDER_SCRIPT_VERSION;
  }

  getOrderSwapScriptPolicyIds(orderSwapScriptVersion: string): string[] {
    const environment = this.configService.getCardanoNetwork();

    if (!orderSwapScriptVersion) {
      throw new Error(
        'Core API version must be specified to retrieve script policy IDs.'
      );
    }

    const config = orderSwapConfigs[environment][orderSwapScriptVersion];
    return config.orderSwapNftPolicyIds;
  }

  getOrderSwapScriptAddresses(orderSwapScriptVersion: string): string[] {
    const environment = this.configService.getCardanoNetwork();

    if (!orderSwapScriptVersion) {
      throw new Error(
        'Core API version must be specified to retrieve script addresses.'
      );
    }

    const config = orderSwapConfigs[environment][orderSwapScriptVersion];
    return config.orderSwapScriptAddresses;
  }
}
