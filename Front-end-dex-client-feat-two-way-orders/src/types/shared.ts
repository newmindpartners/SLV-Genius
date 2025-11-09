export type CallbackHandlers = {
  onRequest?: () => void;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
};

export type GeneratorReturnType<T> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Generator<unknown, infer R, unknown>
  ? R
  : never;
