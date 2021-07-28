import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricsOption = 'oilTemp' | 'tubingPressure' | 'waterTemp' | 'casingPressure' | 'injValveOpen';
export interface MetricsOptions extends Array<MetricsOption> {}

export interface Metrics {
  metricsOptions: MetricsOptions;
}

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metricsOptions: [] as MetricsOptions,
  selectedMetrics: ['oilTemp'] as MetricsOptions,
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataReceived: (state, action: PayloadAction<MetricsOptions>) => {
      state.metricsOptions = action.payload;
    },
    selectMetric: (state, action: PayloadAction<MetricsOption>) => {
      state.selectedMetrics = (action.payload as unknown) as MetricsOptions;
    },
    // metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
