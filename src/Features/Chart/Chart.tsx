import React from 'react';
import { createClient, Provider, useQuery } from 'urql';
import { useSelector } from 'react-redux';
import { IState } from '../../store';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const getTimeSeriesSelector = (state: IState) => {
  const { timeSeries } = state.currentMetrics;
  return {
    timeSeries,
  };
};

const Chart = () => {
  const { timeSeries } = useSelector(getTimeSeriesSelector);

  const chartOptions = React.useMemo(() => {
    const filteredTimeSeries = timeSeries.filter(timeSeriesData => !!timeSeriesData.data);
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
      yAxis: [
        {
          labels: {
            format: '{value}°F',
          },
          title: {
            text: 'Oil Temp',
          },
        },
        {
          labels: {
            format: '{value} PSI',
          },
          title: {
            text: 'Tubing Pressure',
          },
        },
        {
          labels: {
            format: '{value} PSI',
          },
          title: {
            text: 'Casing Pressure',
          },
        },
        {
          labels: {
            format: '{value}°F',
          },
          title: {
            text: 'Water Temp',
          },
        },
        {
          labels: {
            format: '{value}%',
          },
          title: {
            text: 'Inj Valve Open',
          },
        },
        {
          labels: {
            format: '{value}°F',
          },
          title: {
            text: 'Flare Temp',
          },
        },
      ],
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
