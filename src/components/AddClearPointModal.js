import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {inject, observer} from 'mobx-react';
import ImagePicker from 'react-native-image-picker';
import {DismissKeyboardView} from './DismissKeyboardHOC';

const pointEmpty = {
  name: '',
  description: '',
  photo: '',
};

const options = {
  title: 'Выберите изображение',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const AddClearPointModal = ({storePoint}) => {
  const {setShowModalAddPoint, uploadPoints} = storePoint;

  let [point, setPoint] = React.useState(pointEmpty);
  let [showEmptyName, setShowEmptyName] = React.useState(false);
  let [showEmptyImages, setShowEmptyImages] = React.useState(false);
  let [uriPhotos, setUriPhotos] = React.useState([]);

  const updatePoint = (field, value) => {
    setPoint({...point, [field]: value});
    if (field === 'name' && value) {
      setShowEmptyName(false);
    } else {
      setShowEmptyName(true);
    }
  };

  const addPhotos = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (!response.cancelled && response.uri) {
        setShowEmptyImages(false);
        setUriPhotos([...uriPhotos, response.uri]);
      }
    });
  };

  const addPoint = () => {
    if (point.name && uriPhotos.length > 0) {
      uploadPoints(point, uriPhotos);
    } else {
      !point.name && setShowEmptyName(true);
      !uriPhotos.length > 0 && setShowEmptyImages(true);
    }
  };

  return (
    <View style={styles.modalCenter}>
      <DismissKeyboardView>
        <View style={styles.modalView}>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'rgb(230, 230, 240)'}
            style={{right: '-38%', padding: 10, borderRadius: 10}}
            onPress={() => setShowModalAddPoint(false)}>
            <Text style={{fontSize: 17, color: 'rgb(71, 124, 251)'}}>
              закрыть
            </Text>
          </TouchableHighlight>
          <Text style={(styles.modalItemInputText, {fontSize: 22})}>
            Новая свалка
          </Text>
          <View style={styles.modalItemInput}>
            <Text style={styles.modalItemInputText}>Введите название</Text>
            <TextInput
              style={styles.modalItemInputTextInput}
              maxLength={50}
              value={point.name}
              onChangeText={(value) => updatePoint('name', value)}
            />
            {showEmptyName && (
              <Text style={{fontSize: 15, color: 'red'}}>
                Введите название!
              </Text>
            )}
          </View>
          <View style={styles.modalItemInput}>
            <Text style={styles.modalItemInputText}>Введите описание</Text>
            <TextInput
              maxLength={300}
              style={styles.modalItemInputTextInput}
              value={point.description}
              multiline={true}
              onChangeText={(value) => updatePoint('description', value)}
            />
          </View>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <Text style={{fontSize: 20}}>Сфотографируйте мусор</Text>
            <View style={styles.modalViewAddPhoto}>
              <TouchableHighlight
                style={styles.modalButtonAddPhoto}
                onPress={() => addPhotos()}
                disabled={uriPhotos.length > 2}>
                <Text style={{fontSize: 17}}>Добавить фото</Text>
              </TouchableHighlight>
              <Text
                style={{
                  marginTop: 15,
                  right: 0,
                  fontSize: 16,
                }}>{`Добавленно ${uriPhotos.length} фото`}</Text>
            </View>
            {showEmptyImages && (
              <Text style={{fontSize: 15, color: 'red'}}>
                Добавьте фотографии, минимум одну!
              </Text>
            )}
            <View style={styles.itemHorizontal}>
              {uriPhotos.map((uriPhoto) => (
                <Image
                  key={uriPhoto}
                  source={{uri: uriPhoto}}
                  style={{width: 100, height: 100}}
                />
              ))}
            </View>
          </View>
          <View style={{justifyItems: 'center'}}>
            <TouchableHighlight
              style={styles.modalButtonAdd}
              onPress={() => addPoint()}>
              <Text style={{fontSize: 17, textAlign: 'center'}}>
                Добавить свалку
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </DismissKeyboardView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHorizontal: {
    flexDirection: 'row',
    padding: 10,
  },
  modalView: {
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItemInput: {
    paddingHorizontal: 5,
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
    width: 310,
  },
  modalButtonAddPhoto: {
    //paddingHorizontal: 10,
    marginTop: 10,
    marginRight: 5,
    padding: 5,
    backgroundColor: '#AFEEEE',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.black,
  },
  modalViewAddPhoto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  modalButtonAdd: {
    paddingHorizontal: 5,
    marginTop: 30,
    padding: 5,
    backgroundColor: '#AFEEEE',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.black,
    width: 200,
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
  // container: {
  //   ...StyleSheet.absoluteFillObject,
  //   height: 800,
  //   width: 400,
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  // },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default inject('storePoint')(observer(AddClearPointModal));
