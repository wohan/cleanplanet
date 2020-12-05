import {Platform} from 'react-native';
import {observable, computed, action} from 'mobx';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS} from 'react-native-permissions';
import {firebaseApp} from './firebaseApp';
import {firebase} from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';
import storage from '@react-native-firebase/storage';

const coordinateTsk = {
  latitude: 56.483729,
  longitude: 84.984568,
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
  },
];

class StorePoint {
  @observable currentPosition = {...coordinateTsk};
  @observable currentPositionNewPoint = {latitude: null, longitude: null};
  @observable showModalAddPoint = false;
  @observable showMarkerAddPoint = false;
  @observable points = [];
  @observable pointsToAdd = [];

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
  async uploadPoints(name, description, localUri) {
    // console.warn("job uploadPoints", text, localUri);

    const date = Date.now();

    const path = `points/${'idPoint'}/${date}.jpg`;

    await this.uploadPhotoAsync3(localUri, path);

    let db = firebaseApp.firestore();

    db.collection('points')
      .add({
        description,
        name,
        ...this.currentPositionNewPoint,
        id: 'points id',
        photos: [path],
      })
      .then((ref) => {
        console.warn(JSON.stringify(ref));
      })
      .catch((error) => {
        console.warn(JSON.stringify(error));
      });
  }

  // const remoteUri = await this.uploadPhotoAsync(localUri);
  // return new Promise((res, rej) => {
  //   firebaseApp
  //     .collection('points')
  //     .add({
  //       text,
  //       coordinate: this.currentPositionNewPoint,
  //       id: "points id",
  //      // image: remoteUri
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

  uploadPhotoAsync3 = async (uri, path) => {
    const reference = storage().ref(path);
    try {
      await reference.putFile(uri);
    } catch (e) {
      console.warn(JSON.stringify(e));
    }
  };

  @action.bound
  uploadPhotoAsync2 = async (uri, path) => {
    return new Promise(async (res, rej) => {
      var response = null;
      var refChild = null;
      var uploadRef = null;

      try {
        uploadRef = firebaseApp.storage().ref();
      } catch (e) {
        console.warn('uploadRef1 ' + e);
      }

      try {
        console.warn('fetch(uri)', uri);
        response = await RNFetchBlob.fetch('GET', uri);
        console.warn('get response');
      } catch (e) {
        console.warn('response fetch  ' + e);
      }

      try {
        refChild = uploadRef.child(path);
        console.warn('get refChild');
      } catch (e) {
        console.warn('refChild ' + e);
      }

      try {
        console.warn('put in refChild');
        refChild.put(response).then((request) => {
          // res(request);
          console.warn('refChild.put request ', JSON.stringify(request));
        });
      } catch (e) {
        console.warn('refChild.put error ' + JSON.stringify(e));
      }
    });
  };

  upoloadPhoto2 = async (uri) => {
    var storageRef = null;
    var mountainsRef = null;
    const path = `points/${'idPoint'}/${Date.now()}.jpg`;

    try {
      storageRef = firebaseApp.storage().ref();
    } catch (e) {
      console.log('snapshot1 ', JSON.stringify(e));
    }

    try {
      mountainsRef = storageRef.child(path);
    } catch (e) {
      console.log('snapshot2 ', JSON.stringify(e));
    }

    try {
      await fetch(uri).then((file) => {
        mountainsRef.put(file.blob()).then(function (snapshot) {
          console.log('snapshot3 ', JSON.stringify(snapshot));
        });
      });

      RNFetchBlob.fetch(
        'PUT',
        url,
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'file',
            filename: 'photo.jpg',
            type: 'image/png',
            data: RNFetchBlob.wrap(src),
          },
        ],
      )
        .then((file) => {
          mountainsRef.put(file.blob()).then(function (snapshot) {
            console.log('snapshot3 ', JSON.stringify(snapshot));
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log('snapshot3 ', e);
    }
  };

  uploadPhotoAsync = async (uri) => {
    const path = `points/${'idPoint'}/${Date.now()}.jpg`;
    return new Promise(async (res, rej) => {
      var response = null;
      try {
        console.warn(uri);
        response = await fetch(uri);
      } catch (e) {
        console.warn('uploadPhotoAsync1' + e);
      }

      var file = null;
      try {
        file = await response.blob();
      } catch (e) {
        console.warn('uploadPhotoAsync12' + e);
      }
      var upload = null;
      try {
        upload = firebase.storage().ref(path).put(file);
      } catch (e) {
        console.warn('uploadPhotoAsync2' + e);
      }

      upload.on(
        'state_changed',
        (snapshot) => {},
        (err) => {
          console.warn(JSON.stringify(err));
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          console.warn(JSON.stringify(url));
          res(url);
        },
      );
    });
  };
}

export default new StorePoint();
