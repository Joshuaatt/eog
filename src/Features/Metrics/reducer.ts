import { createSlice, PayloadAction } from 'redux-starter-kit';

export interface MetricsOptions
  extends Array<'oilTemp' | 'tubingPressure' | 'waterTemp' | 'casingPressure' | 'injValveOpen'> {}

export interface Metrics {
  metricsOptions: MetricsOptions;
}

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metricsOptions: [] as MetricsOptions,
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataReceived: (state, action: PayloadAction<MetricsOptions>) => {
      state.metricsOptions = action.payload;
    },
    // metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
