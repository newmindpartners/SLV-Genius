export function nonNull<T>(value: T | null): value is T {
  return value !== null;
}

export const recordHasKey =
  <T, K extends keyof T>(key: K) =>
  (item: T): item is T & Record<K, NonNullable<T[K]>> =>
    !!item[key];

// Returns the identity of type `T` as a flattened structure without intersections.
export type Identity<T> = T extends object
  ? {
      [P in keyof T as string extends P ? never : P]: T[P] extends object
        ? Identity<T[P]>
        : T[P];
    }
  : T;

// Equality check for types
// Check source for caveats
// Can be used in conjunction with Identity to determine whether types match
// type EQ2 = IfEquals<Identity<one>, Identity<two>, "same", "different">;
// src: https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same
export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T
  ? 1
  : 2) extends <G>() => G extends U ? 1 : 2
  ? Y
  : N;

// Type safe getKeys
export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;
