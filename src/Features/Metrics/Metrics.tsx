import { createClient, Provider, useQuery } from 'urql';
import React, { useEffect } from 'react';
import { InputLabel, LinearProgress, makeStyles, MenuItem, Select } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { MetricsOptions } from './reducer';
import { IState } from '../../store';

const useStyles = makeStyles({
  metricSelect: {
    width: '100%',
  },
  metricSelectContainer: {
    alignContent: 'center',
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

interface GetMetricsDataResponse {
  getMetrics: MetricsOptions;
}

const MetricLabels = {
  oilTemp: 'Oil Temperature',
  tubingPressure: 'Tubing Pressure',
  waterTemp: 'Water Temperature',
  casingPressure: 'Casing Pressure',
  injValveOpen: 'Injection Valve Open',
};

const getMetricsQueryDocument = `
query {
  getMetrics
}
`;

const getMetrics = (state: IState) => {
  const { metricsOptions } = state.metrics;
  return {
    metricsOptions,
  };
};

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [{ data, fetching, error }] = useQuery<GetMetricsDataResponse>({
    query: getMetricsQueryDocument,
  });
  const { metricsOptions } = useSelector(getMetrics);

  useEffect(() => {
    if (error) {
      // dispatch(actions.metricsApiErrorReceived({ error: error.message }));
    }
    if (!data) return;
    dispatch(actions.metricsDataReceived(data.getMetrics));
  }, [dispatch, data, error]);

  if (fetching || !data) return <LinearProgress />;

  return (
    <div className={classes.metricSelectContainer}>
      <InputLabel>Metrics</InputLabel>
      <Select type="select" className={classes.metricSelect}>
        {metricsOptions.map(metric => (
          <MenuItem value={metric}>{MetricLabels[metric]}</MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};
