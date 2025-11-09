import { combineReducers } from 'redux';
import { api } from '~/redux/api';

import config from './reducer/config';
import wallet from './reducer/wallet';

const reducer = combineReducers({
  config,
  wallet,
  [api.reducerPath]: api.reducer,
});

export default reducer;

export type State = ReturnType<typeof reducer>;
