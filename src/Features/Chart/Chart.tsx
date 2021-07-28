import React from 'react';
import { createClient, Provider } from 'urql';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const Chart = () => {
  return <div>Chart</div>;
};

export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};
