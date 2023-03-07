import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import InCallManager from 'react-native-incall-manager';

import { navigationRef } from './navigationServices';
import { NavigatorMain } from './DrawerNavigator';
import { AuthStackScreen } from './Auth';

export const AppNavigator = () => {
  const userId = useSelector((state) => state.authReducer.userId);
  const navigationRef = useNavigationContainerRef();
  console.log('navigationRef', navigationRef)
  useEffect(() => {
    notificationOpenedApp()

    const onMessageReceived = async (message) => {
      console.log('message-onMessageReceived', message)
      if (Object.keys(message.data).length > 0 && message.data.type == 'video-join' && !!message.data.roomId) {
        InCallManager.startRingtone("_BUNDLE_");
        if (!!navigationRef.current) {
          navigationRef.current.navigate('VideoCallKeepModal', {
            roomId: message.data.roomId,
            displayName: message.data.displayName,
          })
        }
      }
    }

    const unsubscribe = messaging().onMessage(onMessageReceived);
    return () => {
      unsubscribe;
    }
  }, [])

  const notificationOpenedApp = () => {
    messaging()
      .onNotificationOpenedApp(message => {
        console.log(
          'Notification caused app to open from background state:',
          message,
        );
        if (Object.keys(message.data).length > 0 && message.data.type == 'video-join' && !!message.data.roomId) {
          // InCallManager.startRingtone("_BUNDLE_");
          if (!!navigationRef.current) {
            navigationRef.current.navigate('VideoCallKeepModal', {
              roomId: message.data.roomId,
              displayName: message.data.displayName,
            })
          }
        }
      });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(message => {
        if (message) {
          console.log(
            'Notification caused app to open from quit state:',
            message,
          );
          // setInitialRoute(message.data.type); // e.g. "Settings"
          if (Object.keys(message.data).length > 0 && message.data.type == 'video-join' && !!message.data.roomId) {
            // InCallManager.startRingtone("_BUNDLE_");
            if (!!navigationRef.current) {
              navigationRef.current.navigate('VideoCallKeepModal', {
                roomId: message.data.roomId,
                displayName: message.data.displayName,
              })
            }
          }
        }
        // setLoading(false);
      });
  }
  return (
    <NavigationContainer ref={navigationRef}>
      {userId ? <NavigatorMain /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};
