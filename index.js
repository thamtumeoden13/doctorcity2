import React from 'react'
import { AppRegistry, LogBox } from 'react-native';
import App from './src/routers/App.js';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import InCallManager from 'react-native-incall-manager';
import 'react-native-gesture-handler';
LogBox.ignoreAllLogs()

// Register background handler
messaging().setBackgroundMessageHandler(async message => {
    console.log('Message handled in the background!', message);
    if (Object.keys(message.data).length > 0 && message.data.type == 'video-join' && !!message.data.roomId) {
        InCallManager.startRingtone("_BUNDLE_");
    }
});


function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }
    return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

