import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { AppColors } from '../../components/styles/colors';
import { s } from 'react-native-size-matters';
import { AppFonts } from '../../components/styles/fonts';
import { IMAGES } from '../../constants/images-paths';
import { useNotifications } from '../../notifications/useNotifications';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// Modular Firebase imports
import {
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { decrypt } from '../../components/auth/crypto';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true); // true = hide password

  const togglePassword = () => setSecureText(prev => !prev);

  const [error, setError] = useState('');

  const navigation = useNavigation();
  useNotifications();

  const auth = getAuth(); // Modular auth instance

  const handleLogin = async () => {
    try {
      const plainPassword = decrypt(password);
      const fullEmail = email + '@leagueone.com.ph';

      // Modular sign in
      await signInWithEmailAndPassword(auth, fullEmail, plainPassword);

      navigation.navigate('BottomTabs');
    } catch (err: any) {
      console.log('Login error:', err);
      if (err.code === 'auth/wrong-password') {
        Alert.alert('Wrong password');
        setError('Wrong password');
      } else if (err.code === 'auth/user-not-found') {
        Alert.alert('Wrong email');
        setError('User not found');
      } else {
        Alert.alert('Login error', err.message || 'An unknown error occurred');
        setError(err.message || 'An unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={IMAGES.LOGO_SQUARE_WHITE} style={styles.logo} />
      <View style={styles.box}>
        <View style={styles.textInputStyle}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View style={styles.textInputStyle}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText} // key part for hiding text
            style={styles.input}
          />

          <TouchableOpacity onPress={togglePassword} style={styles.toggle}>
            <Text style={{ color: '#007AFF' }}>
              {secureText ? 
              <MaterialIcon name="visibility-off" size={20} color={AppColors.disabledGray} />
               : <MaterialIcon name="visibility" size={20} color={AppColors.disabledGray} />}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin}>
          <View style={styles.buttonText}>
            <Text style={{ color: AppColors.white, fontWeight: 'bold' }}>
              Login
            </Text>
          </View>
        </TouchableOpacity>
        {/* <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
        /> */}
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
  textInputStyle: {
    flexDirection: 'row',
    marginVertical: s(2),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  toggle: {
    marginLeft: 10,
  },
  buttonText: {
    marginTop: 10,
    height: 40,
    fontSize: 16,
    borderRadius: 18,
    backgroundColor: AppColors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    padding: 20,
    backgroundColor: AppColors.white,
    borderRadius: 20,
    elevation: 5,
    marginHorizontal: 20,
    alignSelf: 'stretch',
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
