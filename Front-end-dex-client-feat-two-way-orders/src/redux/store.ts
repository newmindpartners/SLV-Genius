import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import * as Sentry from '@sentry/react';
import createSagaMiddleware from 'redux-saga';
import { configSetBaseUrl, configSetCardanoNetwork } from '~/redux/actions/config';
import { core } from '~/redux/api/core';

import reducer from './rootReducer';
import { root } from './rootSaga';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({});

const sagaMiddleware = createSagaMiddleware();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const coreMiddleware: any = core.middleware;

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(sagaMiddleware)
      .concat(coreMiddleware),
  enhancers: [sentryReduxEnhancer],
});

sagaMiddleware.run(root);

setupListeners(store.dispatch);

store.dispatch(configSetBaseUrl(import.meta.env.VITE_API_URL));
store.dispatch(configSetCardanoNetwork(import.meta.env.VITE_CARDANO_NETWORK));

export default store;
