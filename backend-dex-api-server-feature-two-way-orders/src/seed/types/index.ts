import * as Prisma from '@prisma/client';

export * from './commonGroup';
export * from './orderSaleGroup';
export * from './projectGroup';
export * from './stakingGroup';
export * from './tradingPairGroup';

export enum SeedProjects {
  GENS = 'GENS',
  CRU = 'CRU',
  NINJAZ = 'NINJAZ',
  NMKR = 'NMKR',
  EMP = 'EMP',
  NTX = 'NTX',
  CGV = 'CGV',
  GENSX = 'GENSX',
  LENFI = 'LENFI',
  CLAY = 'CLAY',
  MELD = 'MELD',
  AGIX = 'AGIX',
  HOSKY = 'HOSKY',
  iUSD = 'iUSD',
  SNEK = 'SNEK',
  WMT = 'WMT',
  BOOK = 'BOOK',
  DJED = 'DJED',
  OPTIM = 'OPTIM',
  INDY = 'INDY',
  HUNT = 'HUNT',
  COPI = 'COPI',
  JPG = 'JPG',
  OPT = 'OPT',
  ENCS = 'ENCS',
  IAG = 'IAG',
  LQ = 'LQ',
  NEWM = 'NEWM',
  LIFI = 'LIFI',
  SOC = 'SOC',
  MIN = 'MIN',
  MILK = 'MILK',
  SUNDAE = 'SUNDAE',
  CHRY = 'CHRY',
  iBTC = 'iBTC',
  SHEN = 'SHEN',
  VYFI = 'VYFI',
  RJV = 'RJV',
  FACT = 'FACT',
  FLAC = 'FLAC',
  JELLY = 'JELLY',
  WRT = 'WRT',
  cNETA = 'cNETA',
  iETH = 'iETH',
  FLDT = 'FLDT',
  FREN = 'FREN',
  DRIP = 'DRIP',
  MELD_V2 = 'MELD_V2',
  CBLP = 'CBLP',
  DING = 'DING',
  CNCT = 'CNCT',
  CGI = 'CGI',
  KITUP = 'KITUP',
  AXO = 'AXO',
  SPF = 'SPF',
  MILK_V2 = 'MILK_V2',
  PAVIA = 'PAVIA',
  BTN = 'BTN',
  rsERG = 'rsERG',
  USDM = 'USDM',
  DG = 'DG',
  REACH = 'REACH',
  HYN = 'HYN',
  SPX = 'SPX',
  NVL = 'NVL',
  SPLASH = 'SPLASH',
  MNT = 'MNT',
  C4 = 'C4',
  CLARITY = 'CLARITY',
  CERRA = 'CERRA',
  rsBTC = 'rsBTC',
  rsRSN = 'rsRSN',
  ANGELS = 'ANGELS',
  NIKE = 'NIKE',
  DEDI = 'DEDI',
  SKY = 'SKY',
  MOGI = 'MOGI',
  OMNI = 'OMNI',
  WMTX = 'WMTX',
  OADA = 'OADA',
  sOADA = 'sOADA',
  FRN = 'FRN',
  MNTX = 'MNTX',
  BBSNEK = 'BBSNEK',
  SHARDS = 'SHARDS',
  XER = 'XER',
  CHAD = 'CHAD',
  DANZO = 'DANZO',
  BODEGA = 'BODEGA',
}

export type Asset = Omit<
  Prisma.Prisma.AssetUncheckedCreateInput,
  'decimalPrecision' | 'longName' | 'iconUrl' | 'shortName'
> & {
  longName: NonNullable<Prisma.Prisma.AssetUncheckedCreateInput['longName']>;
  iconUrl: NonNullable<Prisma.Prisma.AssetUncheckedCreateInput['iconUrl']>;
  shortName: NonNullable<Prisma.Prisma.AssetUncheckedCreateInput['shortName']>;
} & Required<Pick<Prisma.Prisma.AssetUncheckedCreateInput, 'decimalPrecision'>>;

export type Project = Omit<
  Prisma.Prisma.ProjectUncheckedCreateInput,
  'projectId'
> &
  Required<Pick<Prisma.Prisma.ProjectUncheckedCreateInput, 'projectId'>>;

export type OrderSaleProject = Omit<
  Prisma.Prisma.OrderSaleProjectUncheckedCreateInput,
  'orderSaleProjectId'
> & {orderSaleProjectId: string};

export type Round = Prisma.Prisma.RoundCreateWithoutOrderSaleProjectInput;

export type RoundWhitelist =
  Prisma.Prisma.RoundWhitelistCreateWithoutRoundInput;

export type OrderSaleBlacklistCountry =
  Prisma.Prisma.OrderSaleBlacklistCountryUncheckedCreateInput;

export type Country = Omit<Prisma.Country, 'created' | 'updated'>;

export type User = Omit<Prisma.Prisma.UserUncheckedCreateInput, 'userId'> &
  Required<Pick<Prisma.Prisma.UserUncheckedCreateInput, 'userId'>>;

export type StakingProject = Omit<
  Prisma.Prisma.StakingProjectUncheckedCreateInput,
  'stakingProjectId'
> &
  Required<
    Pick<Prisma.Prisma.StakingProjectUncheckedCreateInput, 'stakingProjectId'>
  >;
export type StakingNft = Prisma.Prisma.StakingNftUncheckedCreateInput;

export type StakingProjectNft = Omit<
  Prisma.Prisma.StakingProjectNftUncheckedCreateInput,
  'stakingProjectNftId'
> &
  Required<
    Pick<
      Prisma.Prisma.StakingProjectNftUncheckedCreateInput,
      'stakingProjectNftId'
    >
  >;

export type StakingProjectLockOption = Omit<
  Prisma.Prisma.StakingProjectLockOptionUncheckedCreateInput,
  'stakingProjectLockOptionId'
> &
  Required<
    Pick<
      Prisma.Prisma.StakingProjectLockOptionUncheckedCreateInput,
      'stakingProjectLockOptionId'
    >
  >;

export type TradingPair = Prisma.Prisma.TradingPairCreateInput;

export type StakingNftMintingData = Prisma.StakingNftMintingData;
export type StakeVault = Prisma.Prisma.StakeVaultUncheckedCreateInput;

export type UserKyc = Prisma.UserKyc;
export type KycEvent = Prisma.KycEvent;
