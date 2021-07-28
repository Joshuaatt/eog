import React, { useEffect } from 'react';
import { createClient, defaultExchanges, subscriptionExchange, useSubscription, Provider } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { actions } from './reducer';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import { MetricLabels } from '../Metrics/Metrics';

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

const subscription = `
subscription {
    newMeasurement {metric, at, value, unit}
  }
`;

const getMetricsSelector = (state: IState) => {
  const { selectedMetrics } = state.metrics;
  const { newMeasurements } = state.currentMetrics;
  return {
    selectedMetrics,
    newMeasurements,
  };
};

const CurrentMetricData = () => {
  const dispatch = useDispatch();
  const [subscriptionResponse] = useSubscription({ query: subscription });
  const { selectedMetrics, newMeasurements } = useSelector(getMetricsSelector);

  useEffect(() => {
    if (!subscriptionResponse.data) return;
    dispatch(
      actions.currentMetricsDataReceived({
        newMeasurement: subscriptionResponse.data.newMeasurement,
      }),
    );
  }, [dispatch, subscriptionResponse, selectedMetrics]);

  return (
    <div>
      {selectedMetrics.map(selectedMetric => (
        <div>
          {MetricLabels[newMeasurements[selectedMetric].metric]} {newMeasurements[selectedMetric].value}{' '}
          {newMeasurements[selectedMetric].unit}
        </div>
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
