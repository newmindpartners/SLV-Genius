import { OptionDto } from '../../types/OptionDto';

export interface IsOptionOwnedOptions {
  option: OptionDto;
  pubKeyHashes: string[];
}

export const isOptionOwned = ({ option, pubKeyHashes }: IsOptionOwnedOptions) => {
  return pubKeyHashes.includes(option.opiSellerKey);
};
