import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  Alert,
  Platform,
  Linking,
  Dimensions,
  StyleSheet
} from 'react-native';
import * as configs from '../../configs';
import { BaseScreen, Button } from '../../components';
import { useSelector } from 'react-redux';
import styles from './styles';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request as requestPremissions } from 'react-native-permissions';
import { createIV, formatMoney, getDistance, get_vietnam_time } from '../../utils/function';

export default function
  TiepNhanKhachHang({ route, navigation, status }) {
  const [khachHang, setKhachHang] = useState(null);
  const [vitri, setVitri] = useState({
    lat: 0,
    lng: 0,
  });
  const [dichvu, setDichvu] = useState(null);
  const [request, setRequest] = useState(null);
  const [phienKham, setPhienKham] = useState(null);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [distance, setDistance] = useState(0)

  const readyProvider = useSelector(
    (state) => state.commonReducer.readyProvider,
  );
  const readyProviderRef = useSelector(
    (state) => state.commonReducer.readyProviderRef,
  );

  useEffect(() => {
    requestLocationPermission()
  }, [])

  useEffect(() => {
    if (!!readyProvider && !!readyProvider.request) {
      getData();
    }
  }, [readyProvider]);

  useEffect(() => {
    function backAndroid() {
      Alert.alert(
        configs.NAME_APP,
        'Bạn có muốn thoát ứng dụng',
        [
          {
            text: 'Hủy bỏ',
            onPress: () => { },
          },
          {
            text: 'Đồng ý',
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ],
        { cancelable: false },
      );
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAndroid,
    );
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (!!vitri && !!vitri.lat && !!vitri.lng && !!lat && !!long) {
      const viTriKH = { lat: vitri.lat, lng: vitri.lng }
      const viTriNCC = { lat: lat, lng: long }
      console.log('viTriKH', viTriKH)
      console.log('viTriNCC', viTriNCC)
      const distance = getDistance(viTriNCC, viTriKH)
      console.log('distance', distance)
      setDistance(distance)
    }
  }, [vitri, lat, long])

  const requestLocationPermission = async (status) => {
    if (Platform.OS === 'ios') {
      const response = await requestPremissions(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (response === 'granted') {
        localCurrentPosition(status)
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
      }
    }
    else {
      const response = await requestPremissions(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (response === 'granted') {
        localCurrentPosition(status)
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
      }
    }
  }

  const localCurrentPosition = async (status) => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
          console.log('position', position)
          if (status == 1) {
            Receive(position.coords.latitude, position.coords.longitude)
          }
          if (status == 2) {
            handleDaGapKH(position.coords.latitude, position.coords.longitude)
          }
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

  async function getData() {
    try {
      const data = await readyProvider.request.get();
      setRequest(data.data());
      if (data.data()?.phienKham) {
        const pk = await data.data().phienKham.get();
        setPhienKham(pk.data());
      }
      console.log('data.data()?.viTri', data.data()?.viTri)
      setVitri(data.data()?.viTri ? data.data()?.viTri : { lat: 0, lng: 0 });
      const dataKH = await data.data()?.khachHang?.get();
      if (!!dataKH) {
        const { displayName, phoneNumber, sex, ngaySinh, avatarBase64 = '' } = dataKH.data()
        setKhachHang({
          displayName: displayName,
          phoneNumber: phoneNumber,
          avatarBase64: !!avatarBase64 ? avatarBase64 : '',
          sex: sex,
          ngaySinh: ngaySinh,
        });
      }

      const dataDV = await data.data()?.dichVu?.get();
      if (dataDV) {
        setDichvu(dataDV.data());
      }
    } catch (error) {
      console.log(error);
    }
  }

  function cancelWait() {
    // readyProviderRef.update({
    //   request: null,
    //   trangThaiXuLy: '1',
    // });
    if (request?.mainRequest) {
      readyProviderRef.update({
        request: null,
        trangThaiXuLy: '1',
      }).then(() => {
        firestore()
          .doc('fl_content/' + request?.id)
          .update({
            trangThaiXuLy: '1',
            change: request?.id.concat('-1'),
            nhaCungCap: null,
            readyProviderRef: null
          });
        firestore()
          .doc('fl_content/' + request?.mainRequest)
          .update({
            change: request?.id.concat('-1'),
          });
      });
    }
    else {
      readyProviderRef.update({
        request: null,
        trangThaiXuLy: '1',
      }).then(() => {
        firestore()
          .doc('fl_content/' + request?.id)
          .update({
            trangThaiXuLy: '1',
            change: request?.id,
          });
      });
    }
  }

  async function Refuse() {
    readyProviderRef.update({
      request: null,
      trangThaiXuLy: '1',
    });
  }

  const preReceive = () => {
    if (lat == 0 && long == 0) {
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
            onPress: () => { requestLocationPermission(1) },
          },
        ],
        { cancelable: false },
      );
      return
    }
    Receive(lat, long)
  }

  const Receive = (lat, long) => {
    if (request?.mainRequest) {
      readyProviderRef.update({
        trangThaiXuLy: '3',
      }).then(() => {
        firestore()
          .doc('fl_content/' + request?.id)
          .update({
            trangThaiXuLy: '2',
            change: request?.id.concat('-2'),
            viTriNCC: { lat: lat, lng: long },
            nhaCungCap: readyProvider.provider_ref,
            readyProviderRef: readyProviderRef
          });
        firestore()
          .doc('fl_content/' + request?.mainRequest)
          .update({
            change: request?.id.concat('-2'),
          });
      });
    }
    else {
      // const readyProviderGet = await readyProviderRef.get()
      // const requestGet = await readyProviderGet.data().request.get()
      // const requestData = requestGet.data()
      // console.log('requestData', requestData)
      readyProviderRef.update({
        trangThaiXuLy: '3',
      }).then(() => {
        firestore()
          .doc('fl_content/' + request?.id)
          .update({
            trangThaiXuLy: '2',
            viTriNCC: { lat: lat, lng: long },
            change: request?.id,
          });
      });
    }
  }

  const preHandleDaGapKH = () => {
    if (lat == 0 && long == 0) {
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
            onPress: () => { requestLocationPermission(2) },
          },
        ],
        { cancelable: false },
      );
      return
    }
    handleDaGapKH(lat, long)
  }

  const handleDaGapKH = (lat, long) => {
    const time = createIV();
    if (request?.mainRequest) {
      readyProviderRef.update({
        trangThaiXuLy: '5',
      }).then(() => {
        firestore()
          .doc('fl_content/' + request?.id)
          .update({
            trangThaiXuLy: '4',
            change: request?.id.concat('-4'),
            viTriNCC: { lat: lat, lng: long },
            thoiDiemXacNhanGap: time
          });
        firestore()
          .doc('fl_content/' + request?.mainRequest)
          .update({
            change: request?.id.concat('-4'),
          });
      });
      // functions()
      //   .httpsCallable('xac_nhan_gap_mat')(request?.id)
      //   .then((result) => {
      //     console.log('RESULT: ', result);
      //     if (result.data.success) {
      //       readyProviderRef.update({
      //         trangThaiXuLy: '5',
      //       }).then(() => {
      //         firestore()
      //           .doc('fl_content/' + request?.mainRequest)
      //           .update({
      //             change: request?.id.concat('-4'),
      //           });
      //         firestore()
      //           .doc('fl_content/' + request?.id)
      //           .update({
      //             change: request?.id.concat('-4'),
      //             viTriNCC: { lat: lat, lng: long },
      //           });
      //       });
      //     } else {
      //       alert(result.data.reason);
      //     }
      //   });
    } else {
      readyProviderRef.update({
        trangThaiXuLy: '5',
      }).then(() => {
        firestore()
          .doc('fl_content/' + request?.id)
          .update({
            trangThaiXuLy: '4',
            change: request?.id.concat('-4'),
            viTriNCC: { lat: lat, lng: long },
            thoiDiemXacNhanGap: time
          });
      });
      // functions()
      //   .httpsCallable('xac_nhan_gap_mat')(request?.id)
      //   .then((result) => {
      //     console.log('RESULT: ', result);
      //     if (result.data.success) {
      //       readyProviderRef.update({
      //         trangThaiXuLy: '5',
      //       }).then(() => {
      //         firestore()
      //           .doc('fl_content/' + request?.id)
      //           .update({
      //             change: request?.id.concat('-4'),
      //             viTriNCC: { lat: lat, lng: long },
      //           });
      //       });
      //     } else {
      //       alert(result.data.reason);
      //     }
      //   });
    }
  }

  const goiKhachHang = () => {
    let phoneNumber = khachHang?.phoneNumber;
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${khachHang?.phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${khachHang?.phoneNumber}`;
    }
    Linking.openURL(phoneNumber);
  };

  return (
    <BaseScreen
      isToolbar={true}
      titleScreen={status != 3 ? 'Tiếp nhận yêu cầu' : 'Di chuyển'}
      isMenuLeft={true}
      // colorMenuLeft={configs.Colors.agree}
      nameMenuLeft="edit"
      nameMenuRight="phone"
      onPressMenuRight={() => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
          phoneNumber = `tel:${configs.AppDefines.SDT_TT_NCC}`;
        } else {
          phoneNumber = `telprompt:${configs.AppDefines.SDT_TT_NCC}`;
        }
        Linking.openURL(phoneNumber);
      }}
      style={{ paddingHorizontal: 0 }}
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          style={{ height: 180, }}
          contentContainerStyle={{ flexGrow: 1, width: '100%', position: 'absolute', height: 200, paddingTop: 16 }}
        >
          <View style={styles.viewCustomer}>
            <Image
              source={!!khachHang && !!khachHang.avatarBase64 ? { uri: `data:image/png;base64,${khachHang.avatarBase64}`, }
                : { uri: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png' }}
              style={styles.img}
              resizeMode="cover"
            />
            <View style={styles.viewRightCustomer}>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                padding: 1
              }}>{khachHang && khachHang.displayName}</Text>
              {khachHang && khachHang?.ngaySinh ?
                <Text style={{
                  fontSize: 13,
                  color: '#9B9B9B',
                  padding: 1
                }}>{moment(khachHang.ngaySinh).format('DD/MM/YYYY')}</Text> : null}
              {khachHang && khachHang?.sex ?
                <Text style={{
                  fontSize: 13,
                  color: '#9B9B9B',
                  padding: 1
                }}>{khachHang.sex}</Text> : null}
              {status == 3 && (
                <Text
                  style={{
                    fontSize: 13,
                    color: configs.Colors.agree,
                    padding: 1,
                    fontWeight: '500'
                  }}>{khachHang && khachHang?.phoneNumber}</Text>
              )}
            </View>
          </View>
          <View style={styles.viewInfo}>
            {phienKham && phienKham.maPhienKham ?
              <View style={styles.viewLocation}>
                <Text style={styles.txtTitleTip}>Mã phiên khám: </Text>
                <Text>{phienKham && phienKham.maPhienKham}</Text>
              </View> : null
            }
            <View style={styles.viewLocation}>
              <Text style={styles.txtTitleTip}>Dịch vụ: </Text>
              <Text>{dichvu?.tenDichVu}</Text>
            </View>
            <View style={styles.viewLocation}>
              <Text style={styles.txtTitleTip}>Giá: </Text>
              <Text>{!!dichvu?.price ? formatMoney(dichvu?.price, 0) + ' vnđ' : ''}</Text>
            </View>
            <View style={styles.viewLocation}>
              <Text style={styles.txtTitleTip}>Địa điểm: </Text>
              <Text>{vitri && vitri?.address}</Text>
            </View>
            <View style={styles.viewLocation}>
              <Text style={styles.txtTitleTip}>Khoảng cách: </Text>
              <Text>{`${distance > 0 ? (distance / 1000).toFixed(3) : 0} km`}</Text>
            </View>
          </View>
        </ScrollView>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{
            // ...StyleSheet.absoluteFillObject,
            flex: 1,
            height: Dimensions.get('screen').height / 2 + 50, width: '100%', marginBottom: 0
          }}
          region={{
            latitude: vitri?.lat,
            longitude: vitri?.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            coordinate={{
              latitude: vitri?.lat,
              longitude: vitri?.lng,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          />
        </MapView>
      </View>
      {status == 1 ? (
        <View style={styles.viewBottom}>
          <Button
            title="Từ chối"
            onPress={() => Refuse()}
            styles={{
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1.8,
              width: '40%',
              marginHorizontal: '3%',
              marginBottom: 30,
              backgroundColor: configs.Colors.danger
            }}
          />
          <Button
            title="Tiếp nhận"
            onPress={preReceive}
            styles={{
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1.8,
              width: '40%',
              marginHorizontal: '3%',
              marginBottom: 30,
              backgroundColor: configs.Colors.success
            }}
          />
        </View>
      ) : status == 2 ? (
        <View style={styles.viewBottom}>
          <Button
            title="Hủy đợi, chờ khách hàng khác"
            onPress={() => cancelWait()}
            styles={{
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1.8,
              width: '94%',
              marginHorizontal: '3%',
              marginBottom: 30,
              backgroundColor: configs.Colors.danger
            }}
          />
        </View>
      ) : (
        <View style={styles.viewBottom}>
          <Button
            title="Xác nhận gặp"
            onPress={preHandleDaGapKH}
            styles={{
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1.8,
              width: '43%',
              marginHorizontal: '3%',
              marginBottom: 30,
              backgroundColor: configs.Colors.success
            }}
          />
          <Button
            title="Gọi khách hàng"
            onPress={goiKhachHang}
            styles={{
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1.8,
              width: '43%',
              marginHorizontal: '3%',
              marginBottom: 30,
              backgroundColor: configs.Colors.danger
            }}
          />
        </View>
      )}
    </BaseScreen>
  );
}
