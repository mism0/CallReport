import { Alert, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

const requestUserPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('Notification permission granted');
  } else {
    console.log('Notification permission denied');
  }
};

const getToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
  } catch (error) {
    console.log('Failed to get FCM Token: ', error);
  }
};
export const useNotifications = () => {
  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const msgBody =  remoteMessage.notification?.body
      const msgTitle = remoteMessage.notification?.title
      //  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      Alert.alert(msgTitle,msgBody)
    });

    return unsubscribe;
  }, []);
};
