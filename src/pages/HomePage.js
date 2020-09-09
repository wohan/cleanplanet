import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Modal,
} from 'react-native';

import AddClearPointModal from '../components/AddClearPointModal';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MapView, { Marker, Callout } from 'react-native-maps';
import { inject, observer } from 'mobx-react';

const coordinateTsk = {
    latitude: 56.483729,
    longitude: 84.984568,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const HomePage = ({ storePoint }) => {

    const { 
        showModalAddPoint,
        currentPosition,
        setShowModalAddPoint,
        setCoordinateNewPoint,
        getPermissionLocale,
        } = storePoint;

    React.useEffect(() => {
        getPermissionLocale();
        console.warn('showModalAddPoint useEffect', showModalAddPoint);
    }, [currentPosition, showModalAddPoint])
 
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#AFEEEE'}}>
            <Button title={'Меню'}/>
            <Text style={{fontSize: 21, paddingTop: 5, fontWeight: '600', color: 'rgb(74, 128, 252)'}}>Чистая Планета</Text>
            <Button style={{paddingRight: 10, size: 21}} onPress={() => setShowModalAddPoint(true)} title={'+'}/>
          </View>
          <MapView
            style={{ height: '100%'}}
            region={coordinateTsk}
          >
              <Marker draggable
                coordinate={coordinateTsk}
                onDragEnd={(e) => setCoordinateNewPoint(e.nativeEvent.coordinate)}
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
          </MapView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModalAddPoint}
          >
            <AddClearPointModal />
          </Modal>
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

export default inject('storePoint')(observer(HomePage));
