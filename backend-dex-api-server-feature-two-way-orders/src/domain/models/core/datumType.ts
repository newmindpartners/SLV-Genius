export const DatumTypes = {
  INPUT_DATUM: 'INPUT_DATUM',
  ORDER_SWAP_DATUM: 'ORDER_SWAP_DATUM',
};

export type DatumType = (typeof DatumTypes)[keyof typeof DatumTypes];
