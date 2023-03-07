
import React, { useEffect } from 'react';
import { Alert, ToastAndroid, AppState } from 'react-native';
import { Provider } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PersistGate } from 'redux-persist/integration/react';

import { AppNavigator } from './navigator';
import { models } from '../models';
import * as schema from '../models/entity/Schema';
import { store, persistor } from '../stores';
import LoadingScreen from '../screens/LoadingScreen';

Icon.loadFont();

const App = () => {

  useEffect(() => {
    const appNotification = AppState.addEventListener('change', checkNotificationPermission)
    return () => {
      appNotification
    }
  }, []);

  const checkNotificationPermission = async () => {
    const hasPermission = await messaging().hasPermission({
      provisional: true,
    });
    const notDetermined = hasPermission === messaging.AuthorizationStatus.NOT_DETERMINED;
    // console.log('Authorization hasPermission:', notDetermined, hasPermission);
    requestPermission()
  }

  const requestPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        // console.log('Authorization status:', authStatus);
        getFcmToken();
      }
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  const getFcmToken = async () => {
    let fcmToken = await models.getFCMToken();
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (!fcmToken) {
        console.log('Lấy FCM Token thất bại');
        return
      }
    }
    models.setFCMToken(fcmToken);
  }

  const onRegister = (token) => {
    console.log('[Notification] registered', token)
  }

  const onNotification = (notify) => {
    console.log('[Notification] onNotification', notify)
  }

  const onOpenNotification = (notify) => {
    console.log('[onOpenNotification] registered', notify)
    // Alert.alert('Open notification')
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
        <LoadingScreen />
      </PersistGate>
    </Provider>
  );
};

export default App;