export type CreateOption = {
  depositSymbol: string;
  depositToken: string;
  paymentSymbol: string;
  paymentToken: string;
  price: string;
  amount: number;

  start: string;
  end: string;

  usedAddrs: string[];
  change: string;
  collateral: string[];
};

export type ExecuteOption = {
  ref: string;
  amount: string;

  usedAddrs: string[];
  change: string;
  collateral: string;
};

export type RetrieveOption = {
  ref: string;
  amount: string;

  usedAddrs: string[];
  change: string;
  collateral: string;
};
