import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Modal,
  Platform,
  TouchableHighlight,
} from 'react-native';
import AddClearPointModal from '../components/AddClearPointModal';
import MapView, {Marker, Callout} from 'react-native-maps';
import {inject, observer} from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';
import firestore from '@react-native-firebase/firestore';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const delta = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const POINTS = 'points';

const HomePage = ({storePoint, navigation}) => {
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

  let [points, setPoints] = React.useState([]);

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
        console.log('Доступ к камере не предоставлен!');
      }
      if (responsePhotoLibrary !== 'granted') {
        console.log('Доступ к библиотеке не предоставлен!');
      }
    } else {
      console.log('job getPermissionLocale');
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      const responseCamera = await request(PERMISSIONS.ANDROID.CAMERA);
      // const responsePhotoLibrary = await request(PERMISSIONS.ANDROID.PICK_FROM_GALLERY);
      if (response === 'granted') {
        getCurrentPosition();
      }
      if (responseCamera !== 'granted') {
        console.log('Доступ к камере не предоставлен!');
      }
    }
  };

  const loadPoints = async () => {
    firestore()
      .collection(POINTS)
      .get()
      .then((response) => {
        let pointsLocal = [];
        response.forEach((point) => {
          pointsLocal.push({
            id: point.id,
            data: point.data(),
          });
        });
        setPoints(pointsLocal);
      });
  };

  React.useEffect(() => {
    getPermissionLocale();
    loadPoints();
  }, []);

  const createMarkerAddNewPoint = () => {
    return (
      <Marker
        draggable
        coordinate={coordinatePoint}
        onDragEnd={(e) => setCoordinateNewPoint(e.nativeEvent.coordinate)}
        title="Укажите свалку">
        <Callout style={styles.newPoint}>
          <Text>Перенесите на местоположение свалки</Text>
        </Callout>
      </Marker>
    );
  };

  const createMarkerPoint = (point) => {
    const {data, id} = point;

    return (
      <Marker
        coordinate={{
          latitude: data.latitude,
          longitude: data.longitude,
        }}
        title={data.name}>
        <Callout
          style={styles.newPoint}
          onPress={() => navigation.navigate('Point', {point})}>
          <View>
            <Text style={styles.textCalloutValue}>Точка очистки</Text>
            <Text style={styles.textCalloutValue}>Наименование: </Text>
            <Text style={styles.paddingText}>{data.name}</Text>
            <Text style={styles.textCalloutValue}>Описание: </Text>
            <Text>{data.description}</Text>
          </View>
          <TouchableHighlight style={styles.modalButtonAdd}>
            <Text style={styles.textButtonCallout}>Подробнее</Text>
          </TouchableHighlight>
        </Callout>
      </Marker>
    );
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <View>
          <View style={styles.containerHead}>
            <Text style={styles.textHead}>Чистая Планета</Text>
            <Button
              onPress={() => setShowMarkerAddPoint(true)}
              title={'Добавить точку'}
            />
          </View>
          {showMarkerAddPoint && (
            <View>
              <View style={styles.textMessageAddPointContainer}>
                <Text style={styles.textMessageAddPoint}>
                  Перенесите указатель на место на карте где находится точка
                  очистки и добавьте описание.
                </Text>
              </View>
              <View style={styles.containerButton}>
                <Button
                  onPress={() => {
                    setShowMarkerAddPoint(false);
                  }}
                  title="Отмена"
                />
                <Button
                  onPress={() => {
                    setShowModalAddPoint(true);
                  }}
                  title="Добавить свалку"
                />
              </View>
            </View>
          )}
          <MapView style={styles.mapViewContainer} region={coordinatePoint}>
            {showMarkerAddPoint && createMarkerAddNewPoint()}
            {points.length > 0 &&
              points.map((point) => createMarkerPoint(point))}
          </MapView>
          <Modal
            style={styles.containerModal}
            animationType="slide"
            transparent={true}
            visible={showModalAddPoint}>
            <Spinner
              visible={loading}
              textContent={'Загрузка...'}
              textStyle={styles.spinnerTextStyle}
              indicatorStyle={styles.spinnerTextStyle}
            />
            <ScrollView contentContainerStyle={styles.scrollModal}>
              <AddClearPointModal />
            </ScrollView>
          </Modal>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = EStyleSheet.create({
  modalButtonAdd: {
    paddingHorizontal: '0.25rem',
    marginTop: '0.8rem',
    padding: '0.4rem',
    backgroundColor: '#AFEEEE',
    borderWidth: '0.1rem',
    borderRadius: '0.3rem',
    borderColor: Colors.black,
  },
  paddingText: {
    paddingBottom: '0.2rem',
  },
  textButtonCallout: {
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  textCalloutValue: {
    fontSize: '0.95rem',
    fontWeight: '600',
    paddingTop: '0.2rem',
  },
  containerHead: {
    marginBottom: '0.2rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textHead: {
    fontSize: '1.5rem',
    paddingTop: '0.4rem',
    paddingLeft: '0.8rem',
    fontWeight: '600',
    color: '#02cdfa',
  },
  textMessageAddPointContainer: {
    alignItems: 'center',
    backgroundColor: '#78e6ff',
  },
  textMessageAddPoint: {
    margin: '0.5rem',
    fontWeight: '400',
    fontSize: '1rem',
  },
  mapViewContainer: {
    height: '100%',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#78e6ff',
  },
  newPoint: {
    width: '12rem',
    flex: 1,
    position: 'absolute',
  },
  buttonClose: {
    right: '-38%',
    padding: '0.4rem',
    borderRadius: '0.4rem',
  },
  scrollModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerModal: {
    alignContent: 'center',
  },
  spinnerTextStyle: {
    color: '#ff0000',
  },
});

export default inject('storePoint')(observer(HomePage));
