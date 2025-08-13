import { StyleSheet, View, Button } from 'react-native';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MainAppStack from '../navigation/MainAppStack';
import { store } from '../redux/store';
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const GoogleSignInLessons = () => {
  GoogleSignin.configure({
    webClientId:
      '196788206074-u1pse7n8r8thrg7hj0i5v8gma4vt3ee1.apps.googleusercontent.com',
  });

  const [userInfo, setUserInfo] = useState(null);

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log('Response = ', JSON.stringify(response.data, null, 3));
        setUserInfo(response.data);
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  return (
  <View style={{height:35, backgroundColor:"black", marginTop:10}}>
    <Button title="Google Sign-In" onPress={()=> googleSignIn()}/>
  </View>

  );
};

export default GoogleSignInLessons;

const styles = StyleSheet.create({});
