export const formatPercentage = (value: number, withSign?: boolean): string => {
  const sign = value === 0 ? '' : value > 0 ? '+' : '-';
  return `${withSign ? sign : ''}${Math.abs(value).toFixed(2)}%`;
};
