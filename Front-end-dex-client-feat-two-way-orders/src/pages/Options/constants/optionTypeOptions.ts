import { IOption } from '~/types/option';

import { OptionType } from '../types/OptionType';

export const optionTypeOptions: IOption<OptionType>[] = [
  { value: OptionType.Written, label: 'Written' },
  { value: OptionType.Owned, label: 'Owned' },
];
