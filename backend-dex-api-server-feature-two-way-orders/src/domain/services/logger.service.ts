/* eslint-disable @typescript-eslint/no-explicit-any */

export const bigIntStringifyReplacer = (_: unknown, v: unknown) =>
  typeof v === 'bigint' ? v.toString() : v;

export interface LoggerService {
  info(msg?: string, ...args: any): void;

  error(err: Error, msg?: string, ...args: any): void;

  warning(msg?: string, ...args: any): void;

  debug(msg?: string, ...args: any): void;

  trace(msg?: string, ...args: any): void;
}
