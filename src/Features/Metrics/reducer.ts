import { createSlice, PayloadAction } from 'redux-starter-kit';
export enum MetricKeys {
  OilTemp = 'oilTemp',
  TubingPressure = 'tubingPressure',
  CasingPressure = 'casingPressure',
  WaterTemp = 'waterTemp',
  InjValveOpen = 'injValveOpen',
  FlareTemp = 'flareTemp',
}

export const MetricKeysArray = [
  MetricKeys.OilTemp,
  MetricKeys.TubingPressure,
  MetricKeys.WaterTemp,
  MetricKeys.CasingPressure,
  MetricKeys.InjValveOpen,
  MetricKeys.FlareTemp,
];

export const MetricLabels: any = {
  [MetricKeys.OilTemp]: 'Oil Temperature',
  [MetricKeys.TubingPressure]: 'Tubing Pressure',
  [MetricKeys.WaterTemp]: 'Water Temperature',
  [MetricKeys.CasingPressure]: 'Casing Pressure',
  [MetricKeys.InjValveOpen]: 'Injection Valve Open',
  [MetricKeys.FlareTemp]: 'Flare Temp',
};

export const MetricUnits: any = {
  [MetricKeys.OilTemp]: '°F',
  [MetricKeys.TubingPressure]: ' PSI',
  [MetricKeys.WaterTemp]: '°F',
  [MetricKeys.CasingPressure]: ' PSI',
  [MetricKeys.InjValveOpen]: '%',
  [MetricKeys.FlareTemp]: '°F',
};

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
  selectedMetrics: [MetricKeys.OilTemp] as MetricsOptions,
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
    removeMetric: (state, action: PayloadAction<MetricsOption>) => {
      const index = state.selectedMetrics.indexOf(action.payload as any);
      state.selectedMetrics.splice(index, 1);
    },
    // TODO: Error handling
    // metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
