import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import * as configs from '../configs';
import { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DichVu from './DichVu';
import SanPham from './SanPham';
import HuongDanSuDung from './HuongDanSuDung'
import VanBanKhac from './VanBanKhac';
import _ from 'lodash';

const Tab = createBottomTabNavigator();

export default function DangTienHanh({
  yeuCau = null,
}) {
  const [phienKham, setPhienKham] = useState(null)
  const [phienKhamRef, setPhienKhamRef] = useState(null);

  const [diaChi, setDiaChi] = useState([]);
  const [position, setPosition] = useState(null);
  const [badge, setBadge] = useState({
    dichVu: 0,
    donThuoc: 0,
    huongDanSuDung: 0,
    vanBanKhac: 0,
  })

  useEffect(() => {
    if (!!yeuCau && !!yeuCau.phienKham) {
      setDiaChi(yeuCau?.viTri?.address);
      if (yeuCau?.cac_ncc_phu_hop?.length > 0) {
        setPosition(yeuCau?.cac_ncc_phu_hop[yeuCau?.ncc_dang_chon]?.position);
      }
      const subscriber = yeuCau.phienKham?.onSnapshot(async (documentSnapshot) => {
        const phienKham = documentSnapshot.data();
        setPhienKham(phienKham)
        setPhienKhamRef(documentSnapshot._ref);
      });
      return () => subscriber()
    }
  }, [yeuCau, yeuCau.phienKham]);

  const handleSetBadge = (name, value) => {
    console.log('name, value', name, value)
    setBadge(prev => { return { ...prev, [name]: value } })
  }

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: configs.Colors.agree,
        inactiveTintColor: 'rgba(155, 155, 155, 1)',
        labelStyle: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
        style: { backgroundColor: '#fff', paddingTop: 0 },
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen
        name="DichVu"
        children={() =>
          <DichVu
            phienKhamRef={phienKhamRef}
            maPhienKham={phienKham?.maPhienKham}
            trangThaiXuLy={['ĐỀ XUẤT', 'ĐỒNG Ý', '1', '2', '3', '4', '5', '6', '7']}
            diaChi={diaChi} position={position}
            onSetBadge={handleSetBadge}
          />
        }
        options={{
          tabBarLabel: 'Dịch vụ',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5Icons name={'medkit'} color={color} size={size} />
          ),
          tabBarBadge: badge.dichVu > 0 ? badge.dichVu : null,
          tabBarBadgeStyle: { backgroundColor: '#fff', color: 'rgba(155, 155, 155, 1)', fontSize: 14, },
        }}
      />
      <Tab.Screen
        name="DonThuoc"
        children={() =>
          <SanPham
            phienKhamRef={phienKhamRef}
            onSetBadge={handleSetBadge}
          />
        }
        options={{
          tabBarLabel: 'Thuốc',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5Icons name={'pills'} color={color} size={size} />
          ),
          tabBarBadge: badge.donThuoc > 0 ? badge.donThuoc : null,
          tabBarBadgeStyle: { backgroundColor: '#fff', color: 'rgba(155, 155, 155, 1)', fontSize: 14, },
        }}
      />
      <Tab.Screen
        name="HuongDan"
        children={() =>
          <HuongDanSuDung
            phienKhamRef={phienKhamRef}
            onSetBadge={handleSetBadge}
          />
        }
        options={{
          tabBarLabel: 'Tư vấn',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5Icons name={'info'} color={color} size={size} />
          ),
          tabBarBadge: badge.huongDanSuDung > 0 ? badge.huongDanSuDung : null,
          tabBarBadgeStyle: { backgroundColor: '#fff', color: 'rgba(155, 155, 155, 1)', fontSize: 14, },
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
  );
}
