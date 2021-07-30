import { createSlice, PayloadAction } from 'redux-starter-kit';
import { MetricKeys, MetricsOption } from '../Metrics/reducer';

interface NewMeasurement {
  at: number;
  metric: MetricsOption;
  unit: string;
  value: number;
}
interface TimeSeries {
  name: string;
  yAxis: number;
  data?: [number, number][];
  type: 'line';
}

interface CurrentMetricsData {
  newMeasurement: NewMeasurement;
}

const initialNewMeasurementState: NewMeasurement = { at: 0, metric: '' as MetricsOption, unit: '', value: 0 };
const initialTimeSeriesState: TimeSeries = { name: '', yAxis: 0, data: undefined, type: 'line' };
const initialState = {
  newMeasurements: {
    oilTemp: initialNewMeasurementState,
    tubingPressure: initialNewMeasurementState,
    casingPressure: initialNewMeasurementState,
    waterTemp: initialNewMeasurementState,
    injValveOpen: initialNewMeasurementState,
    flareTemp: initialNewMeasurementState,
  },
  timeSeries: [
    { ...initialTimeSeriesState, name: MetricKeys.OilTemp, yAxis: 0 },
    { ...initialTimeSeriesState, name: MetricKeys.TubingPressure, yAxis: 1 },
    { ...initialTimeSeriesState, name: MetricKeys.CasingPressure, yAxis: 2 },
    { ...initialTimeSeriesState, name: MetricKeys.WaterTemp, yAxis: 3 },
    { ...initialTimeSeriesState, name: MetricKeys.InjValveOpen, yAxis: 4 },
    { ...initialTimeSeriesState, name: MetricKeys.FlareTemp, yAxis: 5 },
  ],
};

const slice = createSlice({
  name: 'current metrics data',
  initialState,
  reducers: {
    currentMetricsDataReceived: (state, action: PayloadAction<CurrentMetricsData>) => {
      const { newMeasurement } = action.payload;
      state.newMeasurements[newMeasurement.metric] = newMeasurement;
      const timeSeriesIndex = state.timeSeries.findIndex(ts => ts.name === newMeasurement.metric);
      if (state.timeSeries[timeSeriesIndex].data) {
        state.timeSeries[timeSeriesIndex].data!.push([newMeasurement.at, newMeasurement.value]);
      } else {
        state.timeSeries[timeSeriesIndex].data = [[newMeasurement.at, newMeasurement.value]];
      }
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
