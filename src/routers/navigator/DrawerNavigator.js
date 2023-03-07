import React, { useEffect, useRef } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import CustomDrawer from './CustomDrawer';
import { Colors } from '../../configs';
import { KhachHangStackScreen } from './KhachHangStack';
import { NhaCungCapStackScreen } from './NhaCungCapStack';
import SplashScreen from '../../screens/SplashScreen';
import { screenNames } from './screenNames';
import UpdateProfile from '../../screens/UpdateProfile/UpdateProfile';
import VideoCallScreen from '../../screens/VideoCallScreen/CallScreen'
import VideoJoinScreen from '../../screens/VideoCallScreen/JoinScreen'
import VideoCallModal from '../../screens/VideoCallScreen/VideoCallModal'

const Drawer = createDrawerNavigator();
const StackNavigator = createStackNavigator();
const DrawerNavigator = () => {
  const drawers = [
    {
      name: 'SplashScreen',
      screen: SplashScreen,
      label: 'SplashScreen',
    },
    {
      name: 'KhachHangStackScreen',
      screen: KhachHangStackScreen,
      label: 'KhachHangStackScreen',
    },
    {
      name: 'NhaCungCapStackScreen',
      screen: NhaCungCapStackScreen,
      label: 'NhaCungCapStackScreen',
    },
  ];
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer
        {...props}
      />}
      screenOptions={{
        // gestureEnabled: false,
        swipeEnabled: false
      }}
    >
      {drawers.map(({ name, icon, label, screen }) => (
        <Drawer.Screen
          key={name}
          name={name}
          component={screen}
        />
      ))}

    </Drawer.Navigator>
  );
};

export const NavigatorMain = () => {
  return (
    <StackNavigator.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {/* <StackNavigator.Group> */}
      <StackNavigator.Screen
        name={'Drawer'}
        component={DrawerNavigator}
      />
      <StackNavigator.Screen
        name={screenNames.UpdateProfile}
        component={UpdateProfile}
      />
      {/* </StackNavigator.Group> */}
      {/* <StackNavigator.Group screenOptions={{ presentation: 'modal' }}> */}
      <StackNavigator.Screen name="VideoCallKeepModal" component={VideoCallModal} />
      <StackNavigator.Screen name="VideoCallModal" component={VideoCallScreen} />
      <StackNavigator.Screen name="VideoJoinModal" component={VideoJoinScreen} />
      {/* </StackNavigator.Group> */}
    </StackNavigator.Navigator>
  );
};