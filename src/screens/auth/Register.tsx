import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
// import AppTextInput from '../../components/inputs/AppTextInput';
import { AppColors } from '../../components/styles/colors';
import { register } from '../../components/auth/authService';
import { useNavigation } from '@react-navigation/native';

// import { AppColors } from '../../components/styles/colors';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();
  const handleSignUp = async () => {
    try {

      await register(email, password);
      Alert.alert("Logged in")
       navigation.navigate('Login');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);  
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Welcome back!</Text>
        <Text style={styles.sign}>
          Sign in to your account to access your leasing dashboard
        </Text>

        {/* <Text style={styles.inputTitle}>Username</Text>
        <AppTextInput placeholder="Enter your username" />

        <Text style={styles.inputTitle}>Email address</Text>
        <AppTextInput placeholder="Enter your email" />

        <Text style={styles.inputTitle}>Password</Text>
        <AppTextInput placeholder="Enter your password" /> */}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />

        <Button title="Sign-InS" onPress={handleSignUp} />
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
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
