import React from 'react';
import StorePoint from './src/stores/StorePoint';
import {observer, Provider} from 'mobx-react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomePage from './src/pages/HomePage';
import PointPage from './src/pages/PointPage';

const stores = {
  storePoint: StorePoint,
};

const Stack = createStackNavigator();

@observer
class App extends React.Component {
  render() {
    return (
      <Provider {...stores}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomePage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Point"
              component={PointPage}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
