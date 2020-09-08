
import {Platform} from 'react-native';
import { observable, computed, action } from 'mobx';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS} from 'react-native-permissions';

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
        if(Platform.OS === 'ios') {
          const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          if (response === 'granted') {
            this.getCurrentPosition();
          }
        } else {
            const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          if (response === 'granted') {
            this.getCurrentPosition();
          }
        }
      }

}

export default new StorePoint();