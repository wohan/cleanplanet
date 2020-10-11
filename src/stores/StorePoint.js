
import {Platform} from 'react-native';
import { observable, computed, action } from 'mobx';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS} from 'react-native-permissions';
// import {firebaseApp} from './firebaseApp';
import firebase from 'firebase';
//import { firebaseApp } from './firebaseApp';

const coordinateTsk = {
    latitude: 56.483729,
    longitude: 84.984568,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

var firebaseConfig = {
  apiKey: "AIzaSyB3duX56E6X9eS7a4GtLxrVT8h81LfevWU",
  authDomain: "cleanplanet-58101.firebaseapp.com",
  databaseURL: "https://cleanplanet-58101.firebaseio.com",
  projectId: "cleanplanet-58101",
  storageBucket: "cleanplanet-58101.appspot.com",
  messagingSenderId: "924718130720",
  appId: "1:924718130720:web:50bf2ec9909df46da47e45"
};

const deltaMapView = {
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const pointsOffLine = [
    {
        coords: {
            latitude: 56.483729,
            longitude: 84.984568,
            },
        name: 'Наименование точки уборки',
        description: 'Описание точки убоки',
        photo: 'ссылки на фото в fireStore',
    }
];

class StorePoint {
    //@observable currentPosition = { latitude: null, longitude: null, ...deltaMapView };
    @observable currentPosition = { ...coordinateTsk };
    @observable currentPositionNewPoint = { latitude: null, longitude: null };
    @observable showModalAddPoint = false;
    @observable showMarkerAddPoint = false;
    @observable points = [];
    @observable pointsToAdd = [];

    // constructor() {
    //   firebase.initializeApp(firebaseConfig);
    // }

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
    }

    @action.bound
    getCurrentPosition() {
        Geolocation.getCurrentPosition(info => {
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
            console.warn("Доступ к камере не предоставлен!");
          }
          if (responsePhotoLibrary !== 'granted') {
            console.warn("Доступ к библиотеке не предоставлен!");
          }
        } else {
            const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          if (response === 'granted') {
            this.getCurrentPosition();
          }
        }
      }

      @action.bound
      async uploadPoints(text, localUri) {
        const remoteUri = await this.uploadPhotoAsync(localUri);
        // return new Promise((res, rej) => {
        //   firebaseApp
        //     .collection('points')
        //     .add({
        //       text,
        //       coordinate: this.currentPositionNewPoint,
        //       id: "points id",
        //       image: remoteUri
        //     })
        //     .then(ref => {
        //       console.warn(JSON.stringify(ref));
        //       res(ref)
        //     })
        //     .catch(error => {
        //       console.warn(JSON.stringify(error));
        //       rej(error)
        //     });
        // });
      }

      uploadPhotoAsync = async uri => {
        // const path = `points/${"idPoint"}/${Date.now()}.jpg`;
        // return new Promise(async (res, rej) => {
        //   const response = await fetch(uri);
        //   const file = await response.blob();

        //   let upload = firebase
        //     .storage()
        //     .ref(path)
        //     .put(file);

        //   upload.on(
        //     "state_changed",
        //     snapshot => {},
        //     err => {
        //       console.warn(JSON.stringify(err));
        //       rej(err);
        //     },
        //     async () => {
        //       const url = await upload.snapshot.ref.getDownloadURL();
        //       console.warn(JSON.stringify(url));
        //       res(url);
        //     }
        //   );
        // })
      }
}

export default new StorePoint();
