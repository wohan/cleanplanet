import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Modal,
  Platform,
} from 'react-native';

import AddClearPointModal from '../components/AddClearPointModal';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import MapView, {Marker, Callout} from 'react-native-maps';
import {inject, observer} from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';

const coordinateTsk = {
  latitude: 56.483729,
  longitude: 84.984568,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const delta = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const HomePage = ({storePoint}) => {
  const {
    loading,
    showModalAddPoint,
    showMarkerAddPoint,
    setShowModalAddPoint,
    setShowMarkerAddPoint,
    setCoordinateNewPoint,
  } = storePoint;

  let [coordinatePoint, setCoordinatePoint] = React.useState({
    latitude: 0,
    longitude: 0,
    ...delta,
  });

  const getCurrentPosition = async () => {
    Geolocation.getCurrentPosition(
      (info) => {
        setCoordinatePoint({
          ...coordinatePoint,
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      (error) => {
        console.warn(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getPermissionLocale = async () => {
    if (Platform.OS === 'ios') {
      const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      const responseCamera = await request(PERMISSIONS.IOS.CAMERA);
      const responsePhotoLibrary = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (response === 'granted') {
        getCurrentPosition();
      }
      if (responseCamera !== 'granted') {
        console.warn('Доступ к камере не предоставлен!');
      }
      if (responsePhotoLibrary !== 'granted') {
        console.warn('Доступ к библиотеке не предоставлен!');
      }
    } else {
      console.warn('job getPermissionLocale');
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      const responseCamera = await request(PERMISSIONS.ANDROID.CAMERA);
      // const responsePhotoLibrary = await request(PERMISSIONS.ANDROID.PICK_FROM_GALLERY);
      if (response === 'granted') {
        getCurrentPosition();
      }
      if (responseCamera !== 'granted') {
        console.warn('Доступ к камере не предоставлен!');
      }
    }
  };

  React.useEffect(() => {
    getPermissionLocale();
  }, []);

  const createMarkerAddNewPoint = () => {
    return (
      <Marker
        draggable
        coordinate={coordinatePoint}
        onDragEnd={(e) => setCoordinateNewPoint(e.nativeEvent.coordinate)}
        title="Укажите свалку">
        <Callout style={{width: 200, flex: 1, position: 'absolute'}}>
          <Text>Перенесите на местоположение свалки</Text>
        </Callout>
      </Marker>
    );
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 22,
                paddingTop: 5,
                paddingLeft: 10,
                fontWeight: '600',
                color: '#02cdfa',
              }}>
              Чистая Планета
            </Text>
            <Button
              style={{paddingRight: 10, size: 21}}
              onPress={() => setShowMarkerAddPoint(true)}
              title={'Добавить точку'}
            />
          </View>
          {showMarkerAddPoint && (
            <View>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: '#78e6ff',
                }}>
                <Text style={{margin: 10, fontWeight: '400', fontSize: 17}}>
                  Перенесите указатель на место на карте где находится точка
                  очистки и добавьте описание.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  backgroundColor: '#78e6ff',
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                }}>
                <Button
                  onPress={() => {
                    setShowMarkerAddPoint(false);
                  }}
                  title="Отмена"
                />
                <Button
                  style={{paddingRight: 5}}
                  onPress={() => {
                    setShowModalAddPoint(true);
                  }}
                  title="Добавить свалку"
                />
              </View>
            </View>
          )}
          <MapView
            style={{height: '100%'}}
            region={coordinatePoint}>
            {showMarkerAddPoint && createMarkerAddNewPoint()}
          </MapView>
          <Modal
            style={{alignContent: 'center'}}
            animationType="slide"
            transparent={true}
            visible={showModalAddPoint}>
            <Spinner
              visible={loading}
              textContent={'Загрузка...'}
              textStyle={styles.spinnerTextStyle}
              indicatorStyle={styles.spinnerTextStyle}
            />
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AddClearPointModal />
            </ScrollView>
          </Modal>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItemInput: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  modalItemInputText: {
    fontSize: 20,
  },
  modalItemInputTextInput: {
    borderColor: '#AFEEEE',
    borderWidth: 2,
    borderRadius: 5,
    marginTop: 10,
    padding: 5,
    fontSize: 17,
  },
  modalButtonAddPhoto: {
    paddingHorizontal: 10,
    marginTop: 10,
    padding: 5,
    backgroundColor: '#AFEEEE',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.black,
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
    height: '100%',
  },
  spinnerTextStyle: {
    color: '#ff0000',
  },
});

export default inject('storePoint')(observer(HomePage));
