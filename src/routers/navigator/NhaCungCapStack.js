import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NCCMain from '../../screens/NCCMain';
import TiepNhanKhachHang from '../../screens/TiepNhanKhachHang';
import XemhoSoYeuCau from '../../screens/XemhoSoYeuCau';
import NCC from '../../screens/NCC';
import ThongTinKhachHangScreen from '../../screens/ThongTinKhachHangScreen';
import LichSuCungCap from '../../screens/LichSuCungCap';

const NhaCungCapStack = createStackNavigator();

export const NhaCungCapStackScreen = () => (
  <NhaCungCapStack.Navigator
    screenOptions={{
      gestureEnabled: false,
      headerShown: false,
    }}
    initialRouteName="NCCMain">
    <NhaCungCapStack.Screen
      name="TiepNhanKhachHang"
      component={TiepNhanKhachHang}
    />
    <NhaCungCapStack.Screen name="NCCMain" component={NCCMain} />
    <NhaCungCapStack.Screen name="NCC" component={NCC} />
    <NhaCungCapStack.Screen name="XemhoSoYeuCau" component={XemhoSoYeuCau} />
    <NhaCungCapStack.Screen name='ThongTinKhachHangScreen' component={ThongTinKhachHangScreen} />
    <NhaCungCapStack.Screen name='LichSuCungCap' component={LichSuCungCap} />
  </NhaCungCapStack.Navigator>
);
