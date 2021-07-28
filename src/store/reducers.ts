import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/Metrics/reducer';
import { reducer as currentMetricsDataReducer } from '../Features/CurrentMetricData/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
  currentMetrics: currentMetricsDataReducer,
};
