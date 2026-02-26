import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AppColors } from '../styles/colors';
import { s, vs } from 'react-native-size-matters';
import { IMAGES } from '../../constants/images-paths';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const HomeHeaders = () => {
  const navigation = useNavigation<any>();

 const handleLogout = () => {
  Alert.alert('Logout', 'Are you sure you want to logout?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Logout',
      style: 'destructive',
      onPress: async () => {
        await auth().signOut(); // this triggers App to render AuthStack automatically
      },
    },
  ]);
};

  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <Image source={IMAGES.LEAGUE_ONE} style={styles.logo} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={22} color={AppColors.blueGray} />
      </TouchableOpacity>
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
  logoutButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
});
