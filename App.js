/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Modal,
  Platform
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';

import Geolocation from '@react-native-community/geolocation';

import {request, PERMISSIONS} from 'react-native-permissions';

const App: () => React$Node = () => {

  React.useEffect(() => {
    console.warn("useEffect");
    getPermissionLocale();
  }, [])

  let [coordinate, setCoordinate] = React.useState({
      latitude: 56.483729,
      longitude: 84.984568,
  });

  let [showModalAddPointMaterial, setShowModalAddPointMaterial] = React.useState(false);

  getCurrentPosition = () => {
    Geolocation.getCurrentPosition(info => console.warn(info));
  }

  getPermissionLocale = async () => {
    console.warn("getPermissionLocale ios");
    if(Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      if (response === 'granted') {
        console.warn("getPermissionLocale ios granted");
        getCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      if (response === 'granted') {
        getCurrentPosition();
      }
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button title={'Меню'}/>
          <Text style={{fontSize: 25, fontWeight: '600', color: 'blue'}}>Чистая Планета</Text>
          <Button onPress={() => setShowModalAddPointMaterial(!showModalAddPointMaterial)} title={'Добавить точку'}/>
        </View>
        <MapView
          style={{ height: '100%'}}
          region={{
            latitude: 56.483729,
            longitude: 84.984568,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker draggable
            coordinate={coordinate}
            onDragEnd={(e) => setCoordinate(e.nativeEvent.coordinate)}
            title='Томск'
          >
            <Callout onPress={() => console.warn("onPress")}>
              <Image
                style={{height: 100}}
                source={require('./drawable/im1.jpg')} />
              <Text>Классный город</Text>
              <Button title='go trash'></Button>
            </Callout>
          </Marker>
        </MapView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModalAddPointMaterial}
        >
          <Text>Классный город12121</Text>
        </Modal>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles2 = StyleSheet.create({
  container2: {
    ...StyleSheet.absoluteFillObject,
    height: 800,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: '100%'
  },
 });

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
