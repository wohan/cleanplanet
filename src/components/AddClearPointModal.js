import React, {useState} from 'react';
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

const pointEmpty = {
  coords: {
    latitude: 56.483729,
    longitude: 84.984568,
  },
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
  const {
    setShowModalAddPoint,
    uploadPoints,
  } = storePoint;

  let [point, setPoint] = React.useState(pointEmpty);
  let [uriPhotos, setUriPhotos] = React.useState([]);

  const updatePoint = (field, value) => {
    setPoint({...point, [field]: value});
  };

  const addPhotos = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (!response.cancelled) {
        setUriPhotos([...uriPhotos, response.uri]);
      }
    });
  };

  return (
    <View style={styles.modalCenter}>
      <View style={styles.modalView}>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'rgb(230, 230, 240)'}
          style={{right: '-32%', padding: 10, borderRadius: 10}}
          onPress={() => setShowModalAddPoint(false)}>
          <Text style={{fontSize: 17, color: 'rgb(71, 124, 251)'}}>
            закрыть
          </Text>
        </TouchableHighlight>
        <Text style={(styles.modalItemInputText, {fontSize: 22})}>
          Новая точка очистки
        </Text>
        <View style={styles.modalItemInput}>
          <Text style={styles.modalItemInputText}>
            Введите название точки очистки
          </Text>
          <TextInput
            style={styles.modalItemInputTextInput}
            maxLength={50}
            placeholder={'Введите название точки очистки...'}
            value={point.name}
            onChangeText={(value) => updatePoint('name', value)}
          />
        </View>
        <View style={styles.modalItemInput}>
          <Text style={styles.modalItemInputText}>
            Введите описание точки очистки
          </Text>
          <TextInput
            maxLength={300}
            style={styles.modalItemInputTextInput}
            placeholder={'Введите описание точки очистки...'}
            value={point.description}
            multiline={true}
            onChangeText={(value) => updatePoint('description', value)}
          />
        </View>
        <View style={{marginTop: 20, marginHorizontal: 10}}>
          <Text style={{fontSize: 20}}>Сфотографируйте точку очистки</Text>
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
                fontSize: 16,
              }}>{`Добавленно ${uriPhotos.length} фото`}</Text>
          </View>
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
        <View style={{}} />
        <View style={{justifyItems: 'center'}}>
          <TouchableHighlight
            style={styles.modalButtonAdd}
            onPress={() => uploadPoints(point, uriPhotos)}>
            <Text style={{fontSize: 17}}>Добавить точку</Text>
          </TouchableHighlight>
        </View>
      </View>
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
    width: 310,
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
    paddingHorizontal: 10,
    marginTop: 30,
    padding: 5,
    backgroundColor: '#AFEEEE',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.black,
    width: 150,
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
