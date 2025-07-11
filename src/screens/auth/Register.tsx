import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppTextInput from '../../components/inputs/AppTextInput';
import { AppColors } from '../../components/styles/colors';

// import { AppColors } from '../../components/styles/colors';

const Register = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Welcome back!</Text>
        <Text style={styles.sign}>
          Sign in to your account to access your leasing dashboard
        </Text>

        <Text style={styles.inputTitle}>Username</Text>
        <AppTextInput placeholder="Enter your username" />

        <Text style={styles.inputTitle}>Email address</Text>
        <AppTextInput placeholder="Enter your email" />

        <Text style={styles.inputTitle}>Password</Text>
        <AppTextInput placeholder="Enter your password" />
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
  },
  box: {
    padding: 20,
    backgroundColor: AppColors.white,
    borderRadius: 10,
    elevation: 5,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 32,
    textAlign: 'center',
  },
  sign: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    marginBottom: 30,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
