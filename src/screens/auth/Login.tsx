import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppTextInput from '../../components/inputs/AppTextInput';
import SignInButton from '../../components/buttons/SignInButton';
import { AppColors } from '../../components/styles/colors';
import { s } from 'react-native-size-matters';
import { AppFonts } from '../../components/styles/fonts';
import AppText from '../../components/texts/AppText';
import { IMAGES } from '../../constants/images-paths';

const Login = () => {

  return (
    <View style={styles.container}>

      <Image source={IMAGES.LOGO_SQUARE_WHITE} style={styles.logo} />
      <View style={styles.box}>
        {/* <Text style={styles.text}>Welcome back</Text> */}

        <AppText variant='bold' style={styles.text}>
          Welcome back
        </AppText>

        <AppText variant='medium' style={styles.sign}>
          Sign in to your account to access your dashboard
        </AppText>

        {/* <AppText variant='bold'>Email address</AppText> */}
        <Text style={styles.inputTitle}>Email</Text>
        <AppTextInput placeholder="Enter your email" />

        <Text style={styles.inputTitle}>Password</Text>
        <AppTextInput placeholder="Enter your password"/>

        <SignInButton/>
        {/* <Button  onPress={navigateToRegister} title='Go to Register'/> */}
      </View>
    </View>
  );
};

export default Login;

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
    borderRadius: 20,
    elevation: 5,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
  },
  sign: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    marginBottom: 15,
  },
  inputTitle: {
    fontSize: s(16),
    marginTop: s(10),
    fontWeight: 'bold',
    fontFamily: AppFonts.Medium,
    color: AppColors.primary,
  },
  logo: {
    width: s(150),
    height: s(150),
    marginBottom: s(20),
  },
});
