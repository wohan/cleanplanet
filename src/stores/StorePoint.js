import {Platform} from 'react-native';
import {observable, action} from 'mobx';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS} from 'react-native-permissions';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import {firebaseConfig} from './firebaseApp';

const coordinateTsk = {
  latitude: 56.483729,
  longitude: 84.984568,
};

const deltaMapView = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const POINTS = 'points';

class StorePoint {
  constructor() {
    firebase.initializeApp(firebaseConfig);
  }

  @observable currentPosition = {...coordinateTsk};
  @observable currentPositionNewPoint = {latitude: null, longitude: null};
  @observable showModalAddPoint = false;
  @observable showMarkerAddPoint = false;
  @observable points = [];
  @observable pointsToAdd = [];
  @observable loading = false;

  @action.bound
  setCoordinateNewPoint(coordinate) {
    this.currentPositionNewPoint = coordinate;
  }

  @action.bound
  setShowModalAddPoint(show) {
    this.showModalAddPoint = show;
  }

  @action.bound
  setShowMarkerAddPoint(show) {
    this.showMarkerAddPoint = show;
  }

  @action.bound
  addPoint(pointToAdd) {
    this.pointsToAdd.push(pointToAdd);
    this.showModalAddPoint = false;
    this.showMarkerAddPoint = false;
  }

  @action.bound
  getCurrentPosition() {
    Geolocation.getCurrentPosition((info) => {
      this.setCoordinateNewPoint({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      });
    });
  }

  @action.bound
  async getPermissionLocale() {
    if (Platform.OS === 'ios') {
      const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      const responseCamera = await request(PERMISSIONS.IOS.CAMERA);
      const responsePhotoLibrary = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (response === 'granted') {
        this.getCurrentPosition();
      }
      if (responseCamera !== 'granted') {
        console.warn('Доступ к камере не предоставлен!');
      }
      if (responsePhotoLibrary !== 'granted') {
        console.warn('Доступ к библиотеке не предоставлен!');
      }
    } else {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (response === 'granted') {
        this.getCurrentPosition();
      }
    }
  }

  @action.bound
  async uploadPoints(point, localUri) {
    const date = Date.now();
    const id = this.getUuidv4();
    const {name, description} = point;
    this.loading = true;
    try {
      const paths = localUri.map((_, index) =>
        this.getPathImage(id, date, index),
      );

      for (const uri of localUri) {
        let index = localUri.indexOf(uri);
        await this.uploadPhotoAsync(uri, paths[index]);
      }

      await firestore()
        .collection(POINTS)
        .add({
          id,
          description,
          name,
          ...this.currentPositionNewPoint,
          photos: paths,
        })
        .then((ref) => {
          // console.info('Свалка успешно добавленна!', JSON.stringify(ref));
        })
        .catch((error) => {
          // console.warn(
          //   'error in AddPoints1',
          //   JSON.stringify(this.stringifyObject(error)),
          // );
          // console.warn('error in AddPoints2', JSON.stringify(error));
        });
    } catch (e) {
      // console.warn('error in AddPoints1 catch', e);
    } finally {
      this.loading = false;
      this.showModalAddPoint = false;
      this.showMarkerAddPoint = false;
    }
  }

  stringifyObject = (obj) => {
    if (!obj || typeof obj !== 'object') {
      return obj.toString();
    }

    var seen = [];
    return JSON.stringify(obj, function (key, val) {
      if (val != null && typeof val === 'object') {
        if (seen.indexOf(val) >= 0) {
          return;
        }
        seen.push(val);
      }
      return val;
    });
  };

  getUuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
      c,
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  getPathImage = (id, date, index) => {
    return `points/${id}/${date}-${index}.jpg`;
  };

  uploadPhotoAsync = async (uri, path) => {
    const reference = storage().ref(path);
    try {
      await reference.putFile(uri);
    } catch (e) {
      console.warn('Ошибка при загрузке фото');
    }
  };
}

export default new StorePoint();
