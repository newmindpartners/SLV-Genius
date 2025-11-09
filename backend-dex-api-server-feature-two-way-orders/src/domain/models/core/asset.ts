export type AssetAddresses = string[];

// Types taken from core schema https://github.com/geniusyield/Core/blob/main/web/swagger/api.json

type AssetDissected = {
  amount: string;
  symbol: string;
  token: string;
};

export type AddressAssets = {
  addr: string;
  assets: AssetDissected[];
};
