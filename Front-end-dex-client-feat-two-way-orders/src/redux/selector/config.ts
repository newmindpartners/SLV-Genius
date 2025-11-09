import { createSelector } from 'reselect';
import { ConfigState } from '~/redux/reducer/config';

export const getStateConfig = (state: { config: ConfigState }): ConfigState =>
  state.config;

export const getConfigBaseUrl = createSelector(
  [getStateConfig],
  (state) => state.baseUrl,
);

export const getConfigTargetCardanoNetwork = createSelector(
  [getStateConfig],
  (state) => state.targetCardanoNetwork,
);
