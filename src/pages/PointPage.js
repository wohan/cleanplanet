import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {inject, observer} from 'mobx-react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FlatListSlider} from 'react-native-flatlist-slider';

const PointPage = ({storePoint, navigation, route}) => {
  let [linksPhoto, setLinksPhoto] = React.useState([]);
  const {data, _id} = route.params.point;

  React.useEffect(() => {
    if (data.photos.length > 0) {
      let linksPhotoArray = [];
      data.photos.forEach((link) => {
        storePoint.getLinkImage(link).then((linkImage) => {
          linksPhotoArray.push({image: linkImage});
          if (linksPhotoArray.length === data.photos.length) {
            setLinksPhoto(linksPhotoArray);
          }
        });
      });
    }
  }, []);

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <View>
          <View style={styles.containerHead}>
            <TouchableHighlight onPress={() => navigation.navigate('Home')}>
              <View style={styles.viewBack}>
                <Ionicons
                  name="chevron-back-outline"
                  color={'#194bb8'}
                  size={EStyleSheet.value('$iconSize')}
                />
                <Text style={styles.textBackButton}>Карта</Text>
              </View>
            </TouchableHighlight>
            <Text style={styles.textHead}>Чистая Планета</Text>
          </View>
          <View style={styles.containerImage}>
            {!linksPhoto.length > 0 && (
              <ActivityIndicator style={styles.loading} size="large" />
            )}
            {linksPhoto.length > 0 && (
              <FlatListSlider
                height={EStyleSheet.value('$itemWidth')}
                data={linksPhoto}
                indicatorContainerStyle={{position: 'absolute', bottom: 20}}
                onPress={(item) => () => {}}
                imageKey={'image'}
                autoscroll={false}
              />
            )}
          </View>
          <View style={styles.container}>
            <Text style={styles.textNameFields}>Наименование: </Text>
            <Text style={styles.textFields}>{data.name}</Text>
            <Text style={styles.textNameFields}>Описание: </Text>
            <Text style={styles.textFields}>{data.description}</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = EStyleSheet.create({
  loading: {
    marginTop: '9rem',
  },
  viewBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBackButton: {
    color: '#194bb8',
    fontSize: '1.4rem',
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
  containerHead: {
    marginBottom: '0.8rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHead: {
    fontSize: '1.5rem',
    paddingLeft: '1.25rem',
    fontWeight: '600',
    textAlign: 'center',
    color: '#02cdfa',
  },
  buttonBack: {
    paddingRight: 30,
  },
  containerImage: {
    height: '46.5%',
  },
  viewImages: {
    marginTop: '0.8rem',
    paddingTop: '0.8rem',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
  },
  container: {
    backgroundColor: '#bbeaff',
    margin: '0.8rem',
    padding: '0.8rem',
    borderRadius: '0.8rem',
    height: '43%',
  },
  textNameFields: {
    fontSize: '1.2rem',
    fontWeight: '500',
    paddingTop: 5,
  },
  textFields: {
    fontSize: '1rem',
    fontWeight: '300',
    paddingTop: 5,
  },
});

export default inject('storePoint')(observer(PointPage));
