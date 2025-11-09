export interface PaginatedResults<T> {
  next?: string;
  prev?: string;
  count: number;
  results: T[];
}

export const paginated = <T>(
  results: T[],
  count: number
): PaginatedResults<T> => ({
  count,
  results,
});

export const emptyResults = <T>(): PaginatedResults<T> =>
  <PaginatedResults<T>>{count: 0, results: []};
