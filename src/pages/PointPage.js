import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {inject, observer} from 'mobx-react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FlatListSlider} from 'react-native-flatlist-slider';
import * as colors from '../assets/colors';

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
                  color={colors.blueDark}
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
            <ScrollView>
              <Text style={styles.textFields}>{data.description}</Text>
            </ScrollView>
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
    color: colors.blueDark,
    fontSize: '1.1rem',
  },
  containerHead: {
    marginBottom: '0.4rem',
    marginTop: '0.4rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHead: {
    fontSize: '1.5rem',
    paddingLeft: '1.25rem',
    fontWeight: '600',
    textAlign: 'center',
    color: colors.blueFont,
  },
  containerImage: {
    height: '46.5%',
  },
  container: {
    backgroundColor: colors.blueSuperLight,
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
