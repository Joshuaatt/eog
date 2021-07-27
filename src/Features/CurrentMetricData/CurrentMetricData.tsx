import React from 'react';
import { Provider } from 'react-redux';
import { createClient } from 'urql';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const CurrentMetricData = () => {
  return <div>current metric data</div>;
};

export default () => {
  return (
    <Provider value={client}>
      <CurrentMetricData />
    </Provider>
  );
};
