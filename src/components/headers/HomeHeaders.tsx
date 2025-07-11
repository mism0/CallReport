import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { AppColors } from '../styles/colors';
import { s, vs } from 'react-native-size-matters';
import { IMAGES } from '../../constants/images-paths';

const HomeHeaders = () => {
  return (
    <View style={styles.headerContainer}>
      <Image source={IMAGES.LEAGUE_ONE} style={styles.logo} />
      {/* <Text>HomeHeaders</Text> */}
    </View>
  );
};

export default HomeHeaders;
const styles = StyleSheet.create({
  headerContainer: {
    marginVertical: 10,
    backgroundColor: AppColors.white,
    padding: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: AppColors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: s(160),
    height: vs(25),
    paddingVertical: vs(10),
    resizeMode: 'contain',
  },
});
