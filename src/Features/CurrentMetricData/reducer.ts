import { createSlice, PayloadAction } from 'redux-starter-kit';
import { MetricsOption } from '../Metrics/reducer';

interface NewMeasurement {
  at: number;
  metric: MetricsOption;
  unit: string;
  value: number;
}

interface CurrentMetricsData {
  newMeasurement: NewMeasurement;
}

const initialNewMeasurementState: NewMeasurement = { at: 0, metric: '' as MetricsOption, unit: '', value: 0 };
const initialState = {
  metric: '',
  newMeasurements: {
    oilTemp: initialNewMeasurementState,
    tubingPressure: initialNewMeasurementState,
    casingPressure: initialNewMeasurementState,
    waterTemp: initialNewMeasurementState,
    injValveOpen: initialNewMeasurementState,
    flareTemp: initialNewMeasurementState,
  },
};

const slice = createSlice({
  name: 'current metrics data',
  initialState,
  reducers: {
    currentMetricsDataReceived: (state, action: PayloadAction<CurrentMetricsData>) => {
      const { newMeasurement } = action.payload;
      state.newMeasurements[newMeasurement.metric] = newMeasurement;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
