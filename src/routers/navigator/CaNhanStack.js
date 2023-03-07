import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ThongTinKhachHangScreen from '../../screens/ThongTinKhachHangScreen';
import CaNhan from '../../screens/CaNhan';
import UpdateProfile from '../../screens/UpdateProfile/UpdateProfile';
const CaNhanStack = createStackNavigator();

export const CaNhanStackScreen = () => (
  <CaNhanStack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false
    }}
    initialRouteName="CaNhan"
  >
    <CaNhanStack.Screen name='ThongTinKhachHangScreen' component={ThongTinKhachHangScreen} />
    <CaNhanStack.Screen name='CaNhan' component={CaNhan} />
    <CaNhanStack.Screen name='UpdateProfile' component={UpdateProfile} />
  </CaNhanStack.Navigator>
);