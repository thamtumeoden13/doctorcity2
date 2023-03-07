import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import YeuCauDichVuScreen from '../../screens/YeuCauDichVuScreen';
import DanhSachDichVu from '../../screens/DanhSachDichVuScreen';
import XacNhanNCCScreen from '../../screens/XacNhanNCCScreen';
import ThongTinKhachHangScreen from '../../screens/ThongTinKhachHangScreen';
import SearchDiaChiScreen from '../../screens/SearchDiaChiSceen';
import QLYEUCAUScreen from '../../screens/QLYEUCAUScreen';
import CaNhan from '../../screens/CaNhan';
import LichSuPhienKham from '../../screens/LichSuPhienKham';
import HoaDon from '../../screens/HoaDon';
import CanLamSang from '../../screens/CanLamSang';
import ChiTietPhienKham from '../../screens/ChiTietPhienKham';
import PhieuKetQua from '../../screens/PhieuKetQua';

const KhachHangStack = createStackNavigator();

export const KhachHangStackScreen = () => (
  <KhachHangStack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false
    }}
  >
    <KhachHangStack.Screen name='YeuCauDichVuScreen' component={YeuCauDichVuScreen} />
    <KhachHangStack.Screen name='DanhSachDichVu' component={DanhSachDichVu} />
    <KhachHangStack.Screen name='XacNhanNCCScreen' component={XacNhanNCCScreen} />
    <KhachHangStack.Screen name='ThongTinKhachHangScreen' component={ThongTinKhachHangScreen} />
    <KhachHangStack.Screen name='SearchDiaChiScreen' component={SearchDiaChiScreen} />
    <KhachHangStack.Screen name='QLYEUCAUScreen' component={QLYEUCAUScreen} />
    <KhachHangStack.Screen name='CaNhan' component={CaNhan} />
    <KhachHangStack.Screen name='LichSuPhienKham' component={LichSuPhienKham} />
    <KhachHangStack.Screen name='HoaDon' component={HoaDon} />
    <KhachHangStack.Screen name='CanLamSang' component={CanLamSang} />
    <KhachHangStack.Screen name='ChiTietPhienKham' component={ChiTietPhienKham} />
    <KhachHangStack.Screen name='PhieuKetQua' component={PhieuKetQua} />
  </KhachHangStack.Navigator>
);