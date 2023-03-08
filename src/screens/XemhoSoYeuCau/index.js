import React, { useEffect, useState, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Alert,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import IonIcons from 'react-native-vector-icons/Ionicons';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request as requestPremissions } from 'react-native-permissions';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as configs from '../../configs';
import styles from './styles';
import HienTrang from './HienTrang';
import TrieuChung from './TrieuChung';
import CanLamSang from './CanLamSang'
import XuTri from './XuTri';
import Info from './Info';
import DonThuoc from './DonThuoc';
import common from '../../common/common';
import { BaseScreen, Label, Button } from '../../components';
import { updateReadyProvider, updateReadyProviderRef } from '../../actions';
import { get_vietnam_time, createIV } from '../../utils/function';

const Tab = createBottomTabNavigator();

const TiepNhanKhachHang = ({ route, navigation }) => {
  console.log('render-TiepNhanKhachHang')

  const dispatch = useDispatch();

  const readyProvider = useSelector(
    (state) => state.commonReducer.readyProvider,
  );

  const readyProviderRef = useSelector(
    (state) => state.commonReducer.readyProviderRef,
  );

  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [phienKham, setPhienKham] = useState(null);
  const [phienKhamRef, setPhienKhamRef] = useState(null);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [state, setState] = useState({
    tab: 1,
    isVisibleModal: false,
    isVisibleContent: true,
    hotline: configs.AppDefines.SDT_TT_NCC,
    isExpand: false
  });

  const [badge, setBadge] = useState({
    thongTin: 0,
    trieuChung: 0,
    canLamSang: 0,
    xuTri: 0,
    dichVu: 0,
    donThuoc: 0,
    huongDanSuDung: 0,
    vanBanKhac: 0,
  })


  useEffect(() => {
    requestLocationPermission()
  }, [])

  useEffect(() => {
    if (!!userInfo) {
      setTimeout(async () => {
        const cshn = (await userInfo.nhaCungCap?.coSoDangKyHanhNghe?.get()).data()
        setState(prev => { return { ...prev, hotline: !!cshn && !!cshn.hotline ? cshn.hotline : prev.hotline } })
      });
    }
  }, [userInfo])

  useEffect(() => {
    if (!!readyProviderRef) {
      readyProviderRef.onSnapshot((snap) => {
        if (snap) {
          const data = snap.data();
          dispatch(updateReadyProvider(data));
        }
      });
    }
  }, [readyProviderRef]);

  useEffect(() => {
    if (!!readyProvider && !!readyProvider.request) {
      getReadyProvider()
    }
  }, [readyProvider, readyProvider.request]);

  const getReadyProvider = async () => {
    const readyProviderGet = await readyProvider?.request.get()
    console.log('readyProviderGet-ThongTin', readyProviderGet)
    const readyProviderData = await readyProviderGet.data()
    setState(prev => {
      return {
        ...prev,
        isExpand: readyProviderData.yeuCauHoTro == "1" ? true : false
      }
    })
    console.log('readyProviderData-ThongTin', readyProviderData)

    const phienKham = await readyProviderData.phienKham.get();
    console.log('phienKham-ThongTin', phienKham)
    const phienKhamData = phienKham.data();
    setPhienKham(phienKhamData)
    setPhienKhamRef(phienKham._ref);
  }

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const response = await requestPremissions(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (response === 'granted') {
        localCurrentPosition()
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
      }
    }
    else {
      const response = await requestPremissions(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (response === 'granted') {
        localCurrentPosition()
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
      }
    }
  }

  const localCurrentPosition = async () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
          console.log('position', position)
        },
        (error) => {
          console.log(error.code, error.message);
          Alert.alert(
            'Không lấy được vị trí hiện tại',
            'Chọn Làm mới để định vị vị trí',
            [
              {
                text: 'Bỏ qua',
                onPress: () => { },
              },
              {
                text: 'Làm mới',
                onPress: () => { requestLocationPermission() },
              },
            ],
            { cancelable: false },
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function hoanThanh1() {
    const time = createIV();
    Alert.alert("Xác nhận", "Khách hàng đã thanh toán hay chưa?", [
      {
        text: 'Đã thanh toán',
        onPress: async () => {
          const rq = await readyProvider.request.get();
          readyProviderRef
            .delete().then(() => {
              firestore()
                .doc('fl_content/' + rq.id)
                .update({
                  trangThaiXuLy: '7',
                  thanhToan: true,
                  change: rq.id.concat('-7'),
                  viTriNCC: { lat: lat, lng: long },
                  thoiDiemHoanThanh: time
                })
              firestore()
                .doc('fl_content/' + rq.data().mainRequest)
                .update({
                  change: rq.id.concat('-7'),
                })
            });
        },
      },
      {
        text: 'Chưa thanh toán',
        onPress: async () => {
          const rq = await readyProvider.request.get();
          readyProviderRef
            .delete().then(() => {
              firestore()
                .doc('fl_content/' + rq.id)
                .update({
                  trangThaiXuLy: '7',
                  change: rq.id.concat('-7'),
                  viTriNCC: { lat: lat, lng: long },
                  thoiDiemHoanThanh: time
                });
              firestore()
                .doc('fl_content/' + rq.data().mainRequest)
                .update({
                  change: rq.id.concat('-7'),
                })
            });
        },
      },
      {
        text: 'Hủy',
      },
    ]);

  }
  function updateGiaiDoan() {
    const newArr = [...phienKham?.dichVu];
    newArr[0].info.giaiDoan = String(7);
    phienKhamRef.update({ dichVu: newArr });
  }

  const _changeTab = () => {
    setIsLoading(true)
    Alert.alert(
      'Đây là dịch vụ tính phí!',
      'Bạn có đồng ý tiếp tục?', [
      {
        text: 'Hủy bỏ',
        onPress: () => { setIsLoading(false) },
      },
      {
        text: 'Đồng ý',
        onPress: () => { confirmHelp() },
      },
    ],
      { cancelable: false },
    )
  };

  const confirmHelp = () => {
    setIsLoading(true)
    readyProvider.request.update({
      yeuCauHoTro: '1',
    }).then(() => {
      setIsLoading(false)
      setState(prev => { return { ...prev, isExpand: true } })
      getReadyProvider()
    }).catch((error) => {
      console.log('error: ', error);
      setIsLoading(false)
    });
  }

  const goTrungTam = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${state.hotline}`;
    } else {
      phoneNumber = `telprompt:${state.hotline}`;
    }
    Linking.openURL(phoneNumber);
  };

  const handleSetBadge = (name, value) => {
    console.log('name, value', name, value)
    setBadge(prev => { return { ...prev, [name]: value } })
  }

  return (
    <BaseScreen
      isToolbar={false}
      style={{ backgroundColor: '#fff', paddingHorizontal: 0 }}
      titleScreen=""
      isMenuLeft={false}
      isScroll={true}
    >
      <View style={[styles.viewHeader, { marginTop: 0, justifyContent: 'flex-end' }]}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => hoanThanh1()}
        >
          <Text style={{
            fontSize: 13,
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            paddingVertical: 14
          }}>Hoàn thành dịch vụ</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={configs.Colors.primary} />
        </View>
      ) :
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: configs.Colors.agree,
            inactiveTintColor: 'rgba(155, 155, 155, 1)',
            labelStyle: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
            style: { backgroundColor: '#fff', paddingTop: 8 },
            keyboardHidesTabBar: true,
          }}
          screenOptions={{
            headerShown: false
          }}
        >
          <Tab.Screen
            name="ThongTin"
            children={() =>
              <Info
                userInfo={userInfo}
                phienKhamRef={phienKhamRef}
                onSetBadge={handleSetBadge}
              />
            }
            options={{
              tabBarLabel: 'Thông tin',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5Icons name={'info'} color={color} size={size} />
              ),
              // tabBarBadge: badge.thongTin > 0 ? badge.thongTin : null,
              // tabBarBadgeStyle: { backgroundColor: configs.Colors.agree, color: '#fff' },
            }}
          />
          {!!state.isExpand ?
            <>
              <Tab.Screen
                name="TrieuChung"
                children={() =>
                  <TrieuChung
                    phienKhamRef={phienKhamRef}
                    onSetBadge={handleSetBadge}
                  />
                }
                options={{
                  tabBarLabel: 'Triệu chứng',
                  tabBarIcon: ({ color, size }) => (
                    <FontAwesome5Icons name={'search-plus'} color={color} size={size} />
                  ),
                  tabBarBadge: badge.trieuChung > 0 ? badge.trieuChung : null,
                  tabBarBadgeStyle: { backgroundColor: '#fff', color: 'rgba(155, 155, 155, 1)', fontSize: 14, },
                }}
              />
              <Tab.Screen
                name="CanLamSang"
                children={() =>
                  <CanLamSang
                    phienKhamRef={phienKhamRef}
                    onSetBadge={handleSetBadge}
                  />
                }
                options={{
                  tabBarLabel: 'Thăm dò',
                  tabBarIcon: ({ color, size }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                      <FontistoIcons name={'laboratory'} color={color} size={size * 0.6} />
                      <FontAwesome5Icons name={'microscope'} color={color} size={size * 0.8} />
                    </View>
                  ),
                  tabBarBadge: badge.canLamSang > 0 ? badge.canLamSang : null,
                  tabBarBadgeStyle: { backgroundColor: '#fff', color: 'rgba(155, 155, 155, 1)', fontSize: 14, },
                }}
              />
              <Tab.Screen
                name="XuTri"
                children={() =>
                  <XuTri
                    phienKhamRef={phienKhamRef}
                    onSetBadge={handleSetBadge}
                  />
                }
                options={{
                  tabBarLabel: 'Xử trí',
                  tabBarIcon: ({ color, size }) => (
                    <IonIcons name={'pulse'} color={color} size={size} />
                  ),
                  tabBarBadge: badge.xuTri > 0 ? badge.xuTri : null,
                  tabBarBadgeStyle: {
                    backgroundColor: '#fff',
                    color: 'rgba(155, 155, 155, 1)',
                    fontSize: 14,
                  },
                }}
              />
              <Tab.Screen
                name="DichVu"
                children={() =>
                  <HienTrang
                    phienKhamRef={phienKhamRef}
                    readyProvider={readyProvider}
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
            </>
            :
            <Tab.Screen
              name="HoTro"
              children={() =>
                <HienTrang
                  phienKhamRef={phienKhamRef}
                  readyProvider={readyProvider}
                  onSetBadge={handleSetBadge}
                />
              }
              options={{
                tabBarLabel: 'Hỗ trợ',
                tabBarIcon: ({ color, size }) => (
                  <IonIcons name={'ios-help-circle'} color={color} size={size} />
                ),
              }}
              listeners={{ tabPress: e => _changeTab() }}
            />
          }
          <Tab.Screen
            name="DonThuoc"
            children={() =>
              <DonThuoc
                phienKhamRef={phienKhamRef}
                onSetBadge={handleSetBadge}
              />
            }
            options={{
              tabBarLabel: 'Đơn thuốc',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5Icons name={'pills'} color={color} size={size} />
              ),
              tabBarBadge: badge.donThuoc > 0 ? badge.donThuoc : null,
              tabBarBadgeStyle: { backgroundColor: '#fff', color: 'rgba(155, 155, 155, 1)', fontSize: 14, },
            }}
          />
        </Tab.Navigator>
      }
    </BaseScreen>
  );
}

export default memo(TiepNhanKhachHang)