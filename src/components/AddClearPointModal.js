import React from 'react';
import {
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
import EStyleSheet from 'react-native-extended-stylesheet';

const options = {
  title: 'Выберите изображение',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const AddClearPointModal = ({storePoint}) => {
  const {setShowModalAddPoint, uploadPoints} = storePoint;

  let [point, setPoint] = React.useState({name: '', description: ''});
  let [showEmptyName, setShowEmptyName] = React.useState(false);
  let [showEmptyImages, setShowEmptyImages] = React.useState(false);
  let [uriPhotos, setUriPhotos] = React.useState([]);

  const updatePoint = (field, value) => {
    setPoint({...point, [field]: value});
    if (field === 'name') {
      if (value) {
        setShowEmptyName(false);
      } else {
        setShowEmptyName(true);
      }
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
            style={styles.buttonClose}
            onPress={() => setShowModalAddPoint(false)}>
            <Text
              style={{
                ...styles.modalItemInputText,
                color: 'rgb(71, 124, 251)',
              }}>
              закрыть
            </Text>
          </TouchableHighlight>
          <Text style={styles.textHeader}>Новая свалка</Text>
          <View style={styles.modalItemInput}>
            <Text style={styles.modalItemInputText}>Введите название</Text>
            <TextInput
              style={styles.modalItemInputTextInput}
              maxLength={50}
              value={point.name}
              onChangeText={(value) => updatePoint('name', value)}
            />
            {showEmptyName && (
              <Text style={styles.textWarning}>Введите название!</Text>
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
          <View style={styles.viewPhoto}>
            <Text style={styles.modalItemInputText}>Сфотографируйте мусор</Text>
            <View style={styles.modalViewAddPhoto}>
              <TouchableHighlight
                style={styles.modalButtonAddPhoto}
                onPress={() => addPhotos()}
                disabled={uriPhotos.length > 2}>
                <Text style={styles.textButton}>Добавить фото</Text>
              </TouchableHighlight>
            </View>
            {showEmptyImages && (
              <Text style={styles.textWarning}>
                Добавьте фотографии, минимум одну!
              </Text>
            )}
            <View style={styles.itemHorizontal}>
              {uriPhotos.map((uriPhoto) => (
                <Image
                  key={uriPhoto}
                  source={{uri: uriPhoto}}
                  style={styles.image}
                />
              ))}
            </View>
          </View>
          <View>
            <TouchableHighlight
              style={styles.modalButtonAdd}
              onPress={() => addPoint()}>
              <Text style={styles.textButton}>Добавить свалку</Text>
            </TouchableHighlight>
          </View>
        </View>
      </DismissKeyboardView>
    </View>
  );
};

const styles = EStyleSheet.create({
  buttonClose: {
    right: '-38%',
    padding: '0.4rem',
    borderRadius: '0.4rem',
  },
  textHeader: {
    fontSize: '1.5rem',
  },
  viewPhoto: {
    paddingTop: '1.2rem',
    width: '21rem',
  },
  textWarning: {
    paddingTop: '0.4rem',
    fontSize: '1.1rem',
    color: 'red',
  },
  image: {
    width: '7rem',
    height: '7rem',
  },
  textButton: {
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHorizontal: {
    flexDirection: 'row',
    padding: '0.4rem',
  },
  modalView: {
    backgroundColor: 'white',
    paddingHorizontal: '0.8rem',
    paddingTop: '0.4rem',
    paddingBottom: '1.2rem',
    borderRadius: '0.4rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItemInput: {
    paddingHorizontal: '0.2rem',
    paddingTop: '1.2rem',
  },
  modalItemInputText: {
    fontSize: '1.2rem',
  },
  modalItemInputPhoto: {
    fontSize: '1.2rem',
    paddingTop: '0.4rem',
  },
  containerHead: {
    marginBottom: '0.8rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalItemInputTextInput: {
    borderColor: '#AFEEEE',
    borderWidth: '0.2rem',
    borderRadius: '0.6rem',
    marginTop: '0.4rem',
    padding: '0.2rem',
    fontSize: '1rem',
    width: '21rem',
  },
  modalButtonAddPhoto: {
    marginTop: '0.4rem',
    marginRight: '0.6rem',
    padding: '0.4rem',
    backgroundColor: '#AFEEEE',
    borderWidth: '0.1rem',
    borderRadius: '0.3rem',
    borderColor: Colors.black,
  },
  modalViewAddPhoto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  modalButtonAdd: {
    paddingHorizontal: '0.25rem',
    marginTop: '1.6rem',
    padding: '0.4rem',
    backgroundColor: '#AFEEEE',
    borderWidth: '0.1rem',
    borderRadius: '0.3rem',
    borderColor: Colors.black,
  },
});

export default inject('storePoint')(observer(AddClearPointModal));
