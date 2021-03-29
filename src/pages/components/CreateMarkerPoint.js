import React from 'react';
import {Callout, Marker} from 'react-native-maps';
import {Text, TouchableHighlight, View} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import * as colors from '../../assets/colors';

const CreateMarkerPoint = ({point, navigation}) => {
  const {data, id} = point;

  return (
    <Marker
      coordinate={{
        latitude: data.latitude,
        longitude: data.longitude,
      }}
      key={data.name + data.latitude}
      title={data.name}>
      <Callout
        style={styles.newPoint}
        onPress={() => navigation.navigate('Point', {point})}>
        <View style={styles.infoWrapper}>
          <View>
            <Text style={styles.textCalloutValue}>Точка очистки</Text>
            <Text style={styles.textCalloutValue}>Наименование: </Text>
            <Text style={styles.paddingText}>{data.name}</Text>
            <Text style={styles.textCalloutValue}>Описание: </Text>
            <Text>{data.description}</Text>
          </View>
          <TouchableHighlight style={styles.modalButtonAdd}>
            <Text style={styles.textButtonCallout}>Подробнее</Text>
          </TouchableHighlight>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = EStyleSheet.create({
  infoWrapper: {
    borderRadius: '1rem',
    flex: 1,
  },
  newPoint: {
    width: '12rem',
    flex: 1,
    position: 'absolute',
    borderRadius: '1rem',
    // borderColor: colors.blueSuperLight,
    // borderWidth: '0.1rem',
    padding: '0.4rem',
    //backgroundColor: colors.blueLight,
  },
  modalButtonAdd: {
    paddingHorizontal: '0.25rem',
    marginTop: '0.8rem',
    padding: '0.4rem',
    backgroundColor: colors.blueSuperLight,
    borderWidth: '0.1rem',
    borderRadius: '0.3rem',
    borderColor: Colors.black,
  },
  paddingText: {
    paddingBottom: '0.2rem',
  },
  textButtonCallout: {
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  textCalloutValue: {
    fontSize: '0.95rem',
    fontWeight: '600',
    paddingTop: '0.2rem',
  },
});

export default CreateMarkerPoint;
