import React from 'react';
import StorePoint from './src/stores/StorePoint';
import { observer, Provider } from 'mobx-react';
import HomePage from './src/pages/HomePage';

const stores = {
  storePoint: StorePoint
}

@observer
class App extends React.Component {

  render() {
    return(
      <Provider {...stores}>
        <HomePage />
      </Provider>
    );
  }
}

export default App;
