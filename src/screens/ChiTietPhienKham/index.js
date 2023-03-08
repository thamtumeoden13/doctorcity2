import React, { useEffect, useRef } from 'react';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import * as configs from '../../configs';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DichVu from '../../components/DichVu';
import SanPham from '../../components/SanPham';
import HuongDanSuDung from '../../components/HuongDanSuDung'
import VanBanKhac from '../../components/VanBanKhac';
import _ from 'lodash';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BaseScreen } from '../../components';

const Tab = createBottomTabNavigator();

export default function ChiTietPhienKham() {
  const route = useRoute();
  const navigation = useNavigation();

  const [phienKham, setPhienKham] = useState(null)
  const [phienKhamRef, setPhienKhamRef] = useState(null)


  const [diaChi, setDiaChi] = useState([]);
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    if (!!route && route.params) {
      const phienKham = (route.params) ? (route.params).item : null;
      const phienKham_ref = firestore().collection('fl_content').doc(phienKham?.id);
      setPhienKham(phienKham)
      setPhienKhamRef(phienKham_ref)
    }
  }, [route])

  const backPressed = () => {
    navigation.goBack();
  };

  return (
    <BaseScreen
      isToolbar={true}
      style={{ paddingHorizontal: 0, }}
      titleScreen="Chi tiết phiên khám"
      isMenuLeft
      nameMenuLeft={'chevron-left'}
      onPressMenuLeft={backPressed}
      isScroll={false}
    >
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: configs.Colors.agree,
          inactiveTintColor: 'rgba(155, 155, 155, 1)',
          labelStyle: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
          style: { backgroundColor: '#fff', paddingTop: 0 },
          keyboardHidesTabBar: true,
        }}
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen
          name="DichVu"
          children={() =>
            <DichVu
              phienKhamRef={phienKhamRef}
              maPhienKham={phienKham?.maPhienKham}
              trangThaiXuLy={['ĐỒNG Ý', '1', '2', '3', '4', '5', '6', '7']}
              diaChi={diaChi} position={position}
            />
          }
          options={{
            tabBarLabel: 'Dịch vụ',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5Icons name={'medkit'} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="SanPham"
          children={() =>
            <SanPham
              phienKhamRef={phienKhamRef}
            />}
          options={{
            tabBarLabel: 'Thuốc',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5Icons name={'pills'} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="HuongDan"
          children={() =>
            <HuongDanSuDung
              phienKhamRef={phienKhamRef}
            />
          }
          options={{
            tabBarLabel: 'Tư vấn',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5Icons name={'info'} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="VanBanKhac"
          children={() =>
            <VanBanKhac
              phienKhamRef={phienKhamRef}
              maPhienKham={phienKham?.maPhienKham}
            />
          }
          options={{
            tabBarLabel: 'Tài liệu',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5Icons name={'tasks'} color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </BaseScreen>
  );
}