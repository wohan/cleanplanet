import firebase from 'firebase';
import { firebaseApp } from './firebaseApp';

var firebaseConfig = {
    apiKey: "AIzaSyB3duX56E6X9eS7a4GtLxrVT8h81LfevWU",
    authDomain: "cleanplanet-58101.firebaseapp.com",
    databaseURL: "https://cleanplanet-58101.firebaseio.com",
    projectId: "cleanplanet-58101",
    storageBucket: "cleanplanet-58101.appspot.com",
    messagingSenderId: "924718130720",
    appId: "1:924718130720:web:50bf2ec9909df46da47e45"
  };

class Fire {
    constructor() {
        firebase.initializeApp(firebaseConfig);
    }

    get firestore() {
        return firebase.firestore();
    }

    async uploadPoints(text, localUri) {
        console.warn("uploadPoints");
      const remoteUri = await this.uploadPhotoAsync(localUri);
      return new Promise((res, rej) => {
        firebaseApp
          .collection('points')
          .add({
            text,
            coordinate: this.currentPositionNewPoint,
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
        const path = `points/${"idPoint"}/${Date.now()}.jpg`;
        return new Promise(async (res, rej) => {
          const response = await fetch(uri);
          const file = await response.blob();

          let upload = firebase
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

Fire.shared = new Fire();

export default Fire;