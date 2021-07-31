import React from 'react';
import { createClient, Provider } from 'urql';
import { useSelector } from 'react-redux';
import { IState } from '../../store';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { MetricKeysArray, MetricLabels, MetricUnits } from '../Metrics/reducer';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const getTimeSeriesSelector = (state: IState) => {
  const { selectedMetrics } = state.metrics;
  const { timeSeries } = state.currentMetrics;
  return {
    timeSeries,
    selectedMetrics,
  };
};

const Chart = () => {
  const { timeSeries, selectedMetrics } = useSelector(getTimeSeriesSelector);

  const yAxis = React.useMemo(
    () =>
      MetricKeysArray.map(key => ({
        labels: { format: `{value}${MetricUnits[key]} ` },
        title: { text: MetricLabels[key] },
        visible: selectedMetrics.includes(key as any),
        opposite: selectedMetrics.indexOf(key as any) % 2,
      })),
    [selectedMetrics],
  );

  const chartOptions = React.useMemo(() => {
    const filteredTimeSeries = timeSeries.filter(
      timeSeriesData => !!timeSeriesData.data && selectedMetrics.includes(timeSeriesData.name as any),
    );
    return {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: 'Metrics',
      },
      plotOptions: {
        series: {
          dataGrouping: {
            enabled: false,
          },
        },
        line: {
          marker: {
            enabled: false,
          },
        },
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis,
      series: filteredTimeSeries,
    };
  }, [timeSeries]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} constructorType={'chart'} options={chartOptions} allowChartUpdate />
    </div>
  );
};

export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};
