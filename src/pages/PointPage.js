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
  Image,
  TouchableHighlight,
} from 'react-native';

import AddClearPointModal from '../components/AddClearPointModal';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import MapView, {Marker, Callout} from 'react-native-maps';
import {inject, observer} from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';
import firestore from '@react-native-firebase/firestore';

const PointPage = ({storePoint, navigation, route}) => {
  let [linksPhoto, setLinksPhoto] = React.useState([]);
  let [loadLinks, setLoadLinks] = React.useState(false);
  const {data, id} = route.params.point;

  React.useEffect(() => {
    if (data.photos.length > 0) {
      data.photos.forEach((link) => {
        storePoint.getLinkImage(link).then((linkImage) => {
          setLinksPhoto([...linksPhoto, linkImage]);
        });
      });
    }
  }, []);

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <View>
          <View>
            <Text style={{fontSize: 15, fontWeight: '600'}}>Точка очистки</Text>
            <Text style={{fontSize: 15, fontWeight: '600', paddingTop: 5}}>
              Наименование:{' '}
            </Text>
            <Text style={{paddingBottom: 5}}>{data.name}</Text>
            {linksPhoto.length === data.photos.length ? (
              <Image
                key={data.photos}
                source={{uri: linksPhoto[0]}}
                style={{width: 200, height: 200}}
              />
            ) : (
              <Text>Фото отсутствует!</Text>
            )}
            <Text style={{paddingTop: 5, fontSize: 15, fontWeight: '600'}}>
              Описание:{' '}
            </Text>
            <Text>{data.description}</Text>
          </View>
          <TouchableHighlight
            style={styles.modalButtonAdd}
            onPressIn={() => navigation.navigate('Home')}>
            <Text style={{fontSize: 17, textAlign: 'center'}}>Подробнее</Text>
          </TouchableHighlight>
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
    zIndex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    padding: 5,
    backgroundColor: '#AFEEEE',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.black,
    width: '100%',
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

export default inject('storePoint')(observer(PointPage));
