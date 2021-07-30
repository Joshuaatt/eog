import { createSlice, PayloadAction } from 'redux-starter-kit';

const initialState = { chartData: '' };

const slice = createSlice({
  name: 'metrics charting data',
  initialState,
  reducers: {
    initialChartDataReceived: (state, action) => {
      state.chartData = action.payload;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
