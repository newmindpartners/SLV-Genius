import { createReducer } from '@reduxjs/toolkit';
import {
  CardanoNetwork,
  configSetBaseUrl,
  configSetCardanoNetwork,
} from '~/redux/actions/config';

export interface ConfigState {
  baseUrl: string;
  targetCardanoNetwork: CardanoNetwork | null;
}

const defaultBaseUrl = 'http://localhost:8012';

const initialState: ConfigState = { baseUrl: defaultBaseUrl, targetCardanoNetwork: null };

export default createReducer(initialState, (builder) => {
  builder.addCase(configSetBaseUrl, setConfig);
  builder.addCase(configSetCardanoNetwork, setTargetCardanoNetwork);
});

function setConfig(state: ConfigState, action: ReturnType<typeof configSetBaseUrl>) {
  return { ...state, baseUrl: action.payload };
}

function setTargetCardanoNetwork(
  state: ConfigState,
  action: ReturnType<typeof configSetCardanoNetwork>,
) {
  return { ...state, targetCardanoNetwork: action.payload };
}
