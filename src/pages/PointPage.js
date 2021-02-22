import React from 'react';
import {SafeAreaView, View, Text, StatusBar, Button, Image} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import EStyleSheet from 'react-native-extended-stylesheet';
import {inject, observer} from 'mobx-react';

const styles = EStyleSheet.create({
  containerHead: {
    marginBottom: '0.8rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textHead: {
    fontSize: '1.5rem',
    paddingTop: '0.4rem',
    paddingLeft: '0.8rem',
    fontWeight: '600',
    color: '#02cdfa',
  },
  buttonBack: {
    paddingRight: 30,
  },
  containerImage: {
    height: '43.5%',
  },
  viewImages: {
    marginTop: '0.8rem',
    paddingTop: '0.8rem',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
  },
  image: {
    width: '22rem',
    height: '22rem',
    borderRadius: '1rem',
  },
  container: {
    backgroundColor: '#bbeaff',
    margin: '0.8rem',
    padding: '0.8rem',
    borderRadius: '0.8rem',
    height: '46%',
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

const PointPage = ({storePoint, navigation, route}) => {
  let [linksPhoto, setLinksPhoto] = React.useState([]);
  const {data, _id} = route.params.point;

  React.useEffect(() => {
    if (data.photos.length > 0) {
      let linksPhotoArray = [];
      data.photos.forEach((link) => {
        storePoint.getLinkImage(link).then((linkImage) => {
          linksPhotoArray.push(linkImage);
          if (linksPhotoArray.length === data.photos.length) {
            setLinksPhoto(linksPhotoArray);
          }
        });
      });
    }
  }, []);

  const renderItem = ({item}) => {
    return <Image style={styles.image} source={{uri: item}} />;
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <View>
          <View style={styles.containerHead}>
            <Text style={styles.textHead}>Чистая Планета</Text>
            <Button
              style={styles.buttonBack}
              onPress={() => navigation.navigate('Home')}
              title={'Назад к карте'}
            />
          </View>
          <View style={styles.containerImage}>
            <Carousel
              style={styles.viewImages}
              layout={'default'}
              data={linksPhoto}
              renderItem={renderItem}
              sliderWidth={EStyleSheet.value('$sliderWidth')}
              itemWidth={EStyleSheet.value('$itemWidth')}
            />
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

export default inject('storePoint')(observer(PointPage));
