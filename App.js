import React from 'react';
import StorePoint from './src/stores/StorePoint';
import {observer, Provider} from 'mobx-react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomePage from './src/pages/HomePage';
import PointPage from './src/pages/PointPage';
import {Dimensions} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const {_height, width} = Dimensions.get('window');

EStyleSheet.build({
  $textColor: '#0275d8',
  $sliderWidth: '26rem',
  $itemWidth: '22.2rem',
  $iconSize: '2.2rem',
  // $sliderWidth: '25rem',
  // $itemWidth: '21.2rem',
  $rem: width > 376 ? (width > 415 ? 17 : 16) : 14,
});

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
