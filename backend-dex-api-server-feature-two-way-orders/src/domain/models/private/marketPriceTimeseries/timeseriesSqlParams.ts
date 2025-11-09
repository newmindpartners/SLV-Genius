export type TimeseriesSqlParams = {
  seriesInterval: string;
  seriesStartTimeExpression: string;
  seriesEndTimeExpression: string;
  getBinIntervalExpression: (columnName: string) => string;
};
