import { createClient, Provider, useQuery } from 'urql';
import React, { useEffect } from 'react';
import { InputLabel, LinearProgress, makeStyles, MenuItem, Select, Chip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { actions, MetricLabels, MetricsOption, MetricsOptions } from './reducer';
import { IState } from '../../store';

const useStyles = makeStyles({
  metricSelect: {
    width: '100%',
  },
  metricSelectContainer: {
    alignContent: 'center',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

interface GetMetricsDataResponse {
  getMetrics: MetricsOptions;
}

const GetMetricsQueryDocument = `
  query {
    getMetrics
  }
`;

const getMetricsSelector = (state: IState) => {
  const { metricsOptions, selectedMetrics } = state.metrics;
  return {
    metricsOptions,
    selectedMetrics,
  };
};

const Metrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [{ data, fetching, error }] = useQuery<GetMetricsDataResponse>({
    query: GetMetricsQueryDocument,
  });
  const { metricsOptions, selectedMetrics } = useSelector(getMetricsSelector);

  useEffect(() => {
    if (error) {
      // TODO: Handle errors
      // dispatch(actions.metricsApiErrorReceived({ error: error.message }));
    }
    if (!data) return;
    dispatch(actions.metricsDataReceived(data.getMetrics));
  }, [dispatch, data, error]);

  if (fetching || !data) return <LinearProgress />;
  return (
    <div className={classes.metricSelectContainer}>
      <InputLabel>Metrics</InputLabel>
      <Select
        multiple
        className={classes.metricSelect}
        value={selectedMetrics}
        renderValue={() => (
          <div className={classes.chips}>
            {selectedMetrics.map(value => (
              <Chip key={value} label={MetricLabels[value]} className={classes.chip} />
            ))}
          </div>
        )}
        onChange={e => {
          dispatch(actions.selectMetric(e.target.value as MetricsOption));
        }}
      >
        {metricsOptions.map(metric => (
          <MenuItem key={metric} value={metric}>
            {MetricLabels[metric]}
          </MenuItem>
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
