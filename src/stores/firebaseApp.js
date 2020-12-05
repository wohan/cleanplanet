import firebase from '@react-native-firebase/app';

var firebaseConfig = {
  apiKey: 'AIzaSyB3duX56E6X9eS7a4GtLxrVT8h81LfevWU',
  authDomain: 'cleanplanet-58101.firebaseapp.com',
  databaseURL: 'https://cleanplanet-58101.firebaseio.com',
  projectId: 'cleanplanet-58101',
  storageBucket: 'cleanplanet-58101.appspot.com',
  messagingSenderId: '924718130720',
  appId: '1:924718130720:web:50bf2ec9909df46da47e45',
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
