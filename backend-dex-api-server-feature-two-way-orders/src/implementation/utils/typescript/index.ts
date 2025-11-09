export const isNotNull =
  <K extends string>(key: K) =>
  <T extends {[k in K]: T[K]}>(
    val: T
  ): val is T & {[k in K]: Exclude<T[K], null>} =>
    val[key] !== null;

export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type WithRequired<T, K extends keyof T> = T & {[P in K]-?: T[P]};

// Analogues to array.prototype.shift
export type Shift<T extends any[]> = ((...t: T) => any) extends (
  first: any,
  ...rest: infer Rest
) => any
  ? Rest
  : never;

// use a distributed conditional type here
type ShiftUnion<T> = T extends any[] ? Shift<T> : never;

export type DeepRequired<T, P extends string[]> = T extends object
  ? Omit<T, Extract<keyof T, P[0]>> &
      Required<{
        [K in Extract<keyof T, P[0]>]: NonNullable<
          DeepRequired<T[K], ShiftUnion<P>>
        >;
      }>
  : T;

export type WithNonNullable<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: NonNullable<T[P]>;
};

export type ExtractBySubstring<
  String extends string,
  Substring extends string
  // eslint-disable-next-line
> = String extends `${infer _}${Substring}${infer _}` ? String : never;

export type Nullable<T> = {[K in keyof T]: T[K] | null};

export type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};
