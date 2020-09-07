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
  Platform,
  TouchableHighlight
} from 'react-native';

import {AddClearPointModal} from '../components/AddClearPointModal';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';

import Geolocation from '@react-native-community/geolocation';

import {request, PERMISSIONS} from 'react-native-permissions';
import { TextInput } from 'react-native-gesture-handler';

const clearPointEmpty = {
  name: '',
  description: '',
  photo: ''
};

const coordinateTsk = {
  latitude: 56.483729,
  longitude: 84.984568,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const HomePage: () => React$Node = () => {

    React.useEffect(() => {
      getPermissionLocale();
    }, [coordinate])
  
    let [coordinate, setCoordinate] = React.useState({
        latitude: null,
        longitude: null,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
  
    let [showModalAddPointMaterial, setShowModalAddPointMaterial] = React.useState(false);
  
    getCurrentPosition = () => {
      Geolocation.getCurrentPosition(info => {
        console.warn(info)
        setCoordinate({
          ...coordinate,
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        console.warn(JSON.stringify(coordinate));
      }
      );
    }
  
    getPermissionLocale = async () => {
      console.warn("getPermissionLocale ios");
      if(Platform.OS === 'ios') {
        var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        if (response === 'granted') {
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
            <Button onPress={() => setShowModalAddPointMaterial(!showModalAddPointMaterial)} title={'+'}/>
          </View>
          <MapView
            style={{ height: '100%'}}
            region={coordinate}
          >
            {coordinate.latitude && 
              <Marker draggable
                coordinate={coordinate}
                onDragEnd={(e) => setCoordinate(e.nativeEvent.coordinate)}
                title='Томск'
              >
                <Callout onPress={() => console.warn("onPress")}>
                  <Image
                    style={{height: 100}}
                    source={require('../drawable/im1.jpg')} />
                  <Text>Классный город</Text>
                  <Button title='go trash'></Button>
                </Callout>
              </Marker>
            }
          </MapView>
          </View>
        </SafeAreaView>
      </>
    );
  };
  
  const styles = StyleSheet.create({
    modalCenter: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    modalItemInput: {
      paddingHorizontal: 10,
      paddingTop: 20
    },
    modalItemInputText: {
      fontSize: 20
    },
    modalItemInputTextInput: {
      borderColor: '#AFEEEE',
      borderWidth: 2,
      borderRadius: 5,
      marginTop: 10,
      padding: 5,
      fontSize: 17
    },
    modalButtonAddPhoto: {
      paddingHorizontal: 10,
      marginTop: 10,
      padding: 5,
      backgroundColor: '#AFEEEE',
      borderWidth: 1,
      borderRadius: 6,
      borderColor: Colors.black
    },
    modalViewAddPhoto: {
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-between',
  
    },
    modalButtonAdd: {
      paddingHorizontal: 10,
      marginTop: 30,
      padding: 5,
      backgroundColor: '#AFEEEE',
      borderWidth: 1,
      borderRadius: 6,
      borderColor: Colors.black,
      width: 150,
    },
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
    container: {
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
  
  export default HomePage;