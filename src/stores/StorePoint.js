
import {Platform} from 'react-native';
import { observable, computed, action } from 'mobx';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS} from 'react-native-permissions';
import {firebaseApp} from './firebaseApp';

const coordinateTsk = {
    latitude: 56.483729,
    longitude: 84.984568,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
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
    @observable currentPositionNewPoint = { latitude: null, longitude: null, ...deltaMapView };
    @observable showModalAddPoint = false;
    @observable showMarkerAddPoint = false;
    @observable points = [];
    @observable pointsToAdd = [];

    @action.bound
    setCoordinateNewPoint(coordinate) {
        this.currentPositionNewPoint = {
            ...this.currentPosition,
            ...coordinate
        };
        // this.currentPositionNewPoint = this.currentPosition;
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
        console.warn(JSON.stringify(pointToAdd));
        this.pointsToAdd.push(pointToAdd);
        console.warn(JSON.stringify(this.pointsToAdd));
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
        console.warn("getPermissionLocale ios");
        if (Platform.OS === 'ios') {
          const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          const responseCamera = await request(PERMISSIONS.IOS.CAMERA);
          const responsePhotoLibrary = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
          if (response === 'granted') {
            this.getCurrentPosition();
          }
          if (responseCamera === 'granted') {
            console.warn("responseCamera ios");
          }
          if (responsePhotoLibrary === 'granted') {
            console.warn("responsePhotoLibrary ios");
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
        console.warn('job uploadPoints');
        const remoteUri = await this.uploadPhotoAsync(localUri);
        return new Promise((res, rej) => {
          firebaseApp
            .collection('points')
            .add({
              text,
              id: "points id",
              image: remoteUri
            })
            .then(ref => {
              console.warn(JSON.stringify(ref));
              res(ref)
            })
            .catch(error => {
              console.warn(JSON.stringify(error));
              rej(error)
            });
        });
      }

      uploadPhotoAsync = async uri => {
        console.warn('job uploadPhotoAsync');
        const path = `points/${"idPoint"}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
          const response = await fetch(uri);
          const file = await response.blob();

          let upload = firebaseApp
            .storage()
            .ref(path)
            .put(file);

          upload.on(
            "state_changed",
            snapshot => {},
            err => {
              console.warn(JSON.stringify(err));
              rej(err);
            },
            async () => {
              const url = await upload.snapshot.ref.getDownloadURL();
              console.warn(JSON.stringify(url));
              res(url);
            }
          );
        })
      }
}

export default new StorePoint();