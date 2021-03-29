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
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AddClearPointModal from './components/AddClearPointModal';
import MapView, {Marker, Callout} from 'react-native-maps';
import {inject, observer} from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';
import firestore from '@react-native-firebase/firestore';
import EStyleSheet from 'react-native-extended-stylesheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CreateMarkerPoint from './components/CreateMarkerPoint';
import * as colors from '../assets/colors';

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

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <View>
          <View style={styles.containerHead}>
            <Text style={styles.textHead}>Чистая Планета</Text>
            <TouchableOpacity onPress={() => setShowMarkerAddPoint(true)}>
              <Ionicons
                name="add-outline"
                color={colors.blueDark}
                style={styles.iconAdd}
                size={EStyleSheet.value('$iconSize')}
              />
            </TouchableOpacity>
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
          {!points.length > 0 && (
            <View style={styles.viewLoading}>
              <ActivityIndicator size="small" color={colors.blueDark} />
              <Text style={styles.textLoading}>Загрузка точек...</Text>
            </View>
          )}
          <MapView style={styles.mapViewContainer} region={coordinatePoint}>
            {showMarkerAddPoint && createMarkerAddNewPoint()}
            {points.length > 0 &&
              points.map((point) => (
                <CreateMarkerPoint point={point} navigation={navigation} />
              ))}
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
  viewLoading: {
    flexDirection: 'row',
    paddingLeft: '0.4rem',
    paddingBottom: '0.4rem',
    backgroundColor: colors.pinkLight,
  },
  textLoading: {
    paddingLeft: '0.4rem',
  },
  iconAdd: {
    marginRight: '0.4rem',
  },
  containerHead: {
    paddingTop: '0.4rem',
    paddingBottom: '0.4rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.pinkLight,
  },
  textHead: {
    fontSize: '1.5rem',
    paddingLeft: '7.2rem',
    fontWeight: '800',
    color: colors.blueFont,
  },
  textMessageAddPointContainer: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
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
    backgroundColor: colors.blueLight,
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
    color: colors.red,
  },
});

export default inject('storePoint')(observer(HomePage));
