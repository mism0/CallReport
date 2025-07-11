import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { s, vs } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
//import MaterialIcon from 'react-native-vector-icons/MaterialIcon';// Ensure you have this package installed

const SignInButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('HomeStack')}
      style={styles.button}
    >
      <View style={styles.textView}>
        <Text style={styles.text}>Sign In </Text>
        <MaterialIcon name="arrow-forward" size={25} color={AppColors.yellow} />
      </View>
    </TouchableOpacity>
  );
};

export default SignInButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: AppColors.green,
    padding: s(10),
    height: vs(40),
    borderRadius: s(25),
    alignItems: 'center',
    marginTop: s(20),
    justifyContent: 'center', // Center the text vertically
    elevation: 3, // Add shadow for Android
  },
  textView: {
    flexDirection: 'row',
    alignItems: 'center', // Center the text and icon vertically
  },
  text: {
    color: '#FFFFFF',
    fontSize: s(16),
    fontWeight: 'bold',
  },
});
