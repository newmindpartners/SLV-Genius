import { OptionDto } from '../../types/OptionDto';

export const compareOptions = (a: OptionDto, b: OptionDto): number => {
  if (a.asset < b.asset) {
    return -1;
  } else if (a.asset > b.asset) {
    return 1;
  }
  return 0;
};
