import React, { useEffect } from 'react';
import { createClient, defaultExchanges, subscriptionExchange, useSubscription, Provider, useQuery } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { actions } from './reducer';
import { actions as currentMetricDataActions } from '../Metrics/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import { MetricKeysArray, MetricLabels } from '../Metrics/reducer';
import { makeStyles, Paper } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';

const useStyles = makeStyles({
  currentMetricsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  card: {
    padding: '20px 40px',
    minWidth: 200,
    margin: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  value: {
    fontSize: '2em',
  },
  label: {
    fontSize: '1.2em',
  },
  clearIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    background: 'red',
    borderRadius: '100%',
    height: '2em',
    width: '2em',
    color: 'white',
    fontSize: 8,
    '&:hover': {
      background: 'black',
    },
  },
});

const subscriptionClient = new SubscriptionClient('wss://react.eogresources.com/graphql', {
  reconnect: true,
  timeout: 20000,
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

const CurrentMetricsSubscriptionDocument = `
  subscription {
    newMeasurement {metric, at, value, unit}
  }
`;

const HistoricalMetricsDocument = `
  query ($input: [MeasurementQuery!]!) {
    getMultipleMeasurements(input: $input) { 
      metric
      measurements {
        metric
        at
        value
        unit
      } }
  }
`;

const getMetricsSelector = (state: IState) => {
  const { selectedMetrics } = state.metrics;
  const { newMeasurements, historicDataStartTime } = state.currentMetrics;
  return {
    selectedMetrics,
    newMeasurements,
    historicDataStartTime,
  };
};

const CurrentMetricData = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [subscriptionResponse] = useSubscription({ query: CurrentMetricsSubscriptionDocument });
  const { selectedMetrics, newMeasurements, historicDataStartTime } = useSelector(getMetricsSelector);

  // Fetch historical data
  const after = historicDataStartTime - 24 * 3600;
  const before = historicDataStartTime;
  const input = React.useMemo(() => MetricKeysArray.map(key => ({ metricName: key, after, before })), [after, before]);
  const [{ data, fetching, error }] = useQuery({
    query: HistoricalMetricsDocument,
    variables: {
      input,
    },
    pause: historicDataStartTime === 0,
  });

  useEffect(() => {
    if (data) {
      dispatch(actions.prependHistoricData({ multipleMeasurements: data.getMultipleMeasurements }));
    }
  }, [data]);

  useEffect(() => {
    if (!subscriptionResponse.data) return;
    dispatch(
      actions.currentMetricsDataReceived({
        newMeasurement: subscriptionResponse.data.newMeasurement,
      }),
    );
  }, [dispatch, subscriptionResponse, selectedMetrics]);

  return (
    <div className={classes.currentMetricsContainer}>
      {selectedMetrics.map(selectedMetric => (
        <Paper className={classes.card} key={selectedMetric}>
          <Clear
            className={classes.clearIcon}
            onClick={() => dispatch(currentMetricDataActions.removeMetric(selectedMetric))}
          />
          <div className={classes.label}>{MetricLabels[newMeasurements[selectedMetric].metric]}</div>
          <div className={classes.value}>
            {newMeasurements[selectedMetric].value} {newMeasurements[selectedMetric].unit}
          </div>
        </Paper>
      ))}
    </div>
  );
};

export default () => {
  return (
    <Provider value={client}>
      <CurrentMetricData />
    </Provider>
  );
};
