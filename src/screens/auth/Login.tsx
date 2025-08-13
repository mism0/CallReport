import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import AppTextInput from '../../components/inputs/AppTextInput';
import SignInButton from '../../components/buttons/SignInButton';
import { AppColors } from '../../components/styles/colors';
import { s } from 'react-native-size-matters';
import { AppFonts } from '../../components/styles/fonts';
import AppText from '../../components/texts/AppText';
import { IMAGES } from '../../constants/images-paths';
import { useNotifications } from '../../notifications/useNotifications';
import GoogleSignInLessons from '../../lessons/GoogleSignInLessons';
import Register from './Register';
import { useNavigation } from '@react-navigation/native';
import { login } from '../../components/auth/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();

  useNotifications();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate('HomeStack');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        Alert.alert("Wrong password")
      } else {
        setError('An unknown error occurred.');
        Alert.alert("Wrong email")
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* useNotifications() */}

      <Image source={IMAGES.LOGO_SQUARE_WHITE} style={styles.logo} />
      <View style={styles.box}>
        {/* <Text style={styles.text}>Welcome back</Text> */}

        {/* <AppText variant='bold' style={styles.text}>
          Welcome back
        </AppText>

        <AppText variant='medium' style={styles.sign}>
          Sign in to your account to access your dashboard
        </AppText> */}

        {/* <AppText variant='bold'>Email address</AppText> */}
        {/* <Text style={styles.inputTitle}>Emaiil</Text>
        <AppTextInput placeholder="Enter your email" />

        <Text style={styles.inputTitle}>Password</Text>
        <AppTextInput placeholder="Enter your password"/> */}

        {/* <SignInButton handleLogin={handleLogin}/> */}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{ borderWidth: 1, marginBottom: 10, padding: 8}}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, marginBottom: 10, padding: 8}}
        />

        <Button title="Login" onPress={handleLogin} />
        {/* <GoogleSignInLessons/> */}
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
        />
        {/* <utton  onPress={navigateToRegister} title='Go to Register'/> */}
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
    alignSelf:"stretch"
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
