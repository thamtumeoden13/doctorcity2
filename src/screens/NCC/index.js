import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import * as configs from '../../configs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import firestore from '@react-native-firebase/firestore';
// import GetLocation from 'react-native-get-location';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request } from 'react-native-permissions';

import apiApp from '../../api/index';
import { updateReadyProvider, updateReadyProviderRef } from '../../actions';
import { BaseScreen, Button, Label } from '../../components';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function NCC({ route, navigation, loading }) {
  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const readyProvider = useSelector(
    (state) => state.commonReducer.readyProvider,
  );
  const readyProviderRef = useSelector(
    (state) => state.commonReducer.readyProviderRef,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [address, setAddress] = useState(null);
  const [firstMount, setFirstMount] = useState(true);
  const [cshn, setCSHN] = useState({});
  const dispatch = useDispatch();

  const backPressed = () => {
    navigation.goBack();
  };

  useEffect(() => {
    requestLocationPermission()
  }, [])

  useEffect(() => {
    setFirstMount(false);
    getThongTin();
  }, [userInfo]);

  useEffect(() => {
    function backAndroid() {
      if (loading) cancleReady();
      else {
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
      }
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAndroid,
    );
    return () => backHandler.remove();
  }, [loading]);

  useEffect(() => {
    if (!firstMount && !loading && !!readyProviderRef) {
      let dataToAdd = {
        _fl_meta_: genfl_meta(userInfo.uIDs, readyProviderRef?.id),
        id: readyProviderRef?.id,
        current_position: {
          lat: lat,
          lng: long,
          address: address,
        },
        trangThaiXuLy: '1',
        provider_ref: firestore().doc(`fl_content/${userInfo.id}`),
      };
      readyProviderRef
        .set(dataToAdd)
        .then((result) => { })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [readyProviderRef]);

  useEffect(() => {
    if (!!readyProviderRef && !!readyProvider && Object.keys(readyProvider).length > 0
      && lat && long && (readyProvider.current_position.lat != lat || readyProvider.current_position.lng != long)) {
      readyProviderRef.update({
        current_position: {
          lat: lat,
          lng: long,
          address: address,
        },
      });
    }
  }, [readyProviderRef, readyProvider, lat, long])

  const getThongTin = async () => {
    const cshn = await userInfo?.nhaCungCap?.coSoDangKyHanhNghe?.get();
    setCSHN(cshn?.data() || {});
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (response === 'granted') {
        localCurrentPosition()
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
        setIsLoading(false);
      }
    }
    else {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (response === 'granted') {
        localCurrentPosition()
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
        setIsLoading(false);
      }
    }
  }

  const localCurrentPosition = async () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
          setIsLoading(false);
        },
        (error) => {
          // console.log(error.code, error.message);
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
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      setIsLoading(false);
      // alert('Không thể xác định được vị trí của bạn');
      console.log(error);
    }
  }

  async function updateReady() {
    setIsLoading(true);
    if (lat == 0 && long == 0) {
      Alert.alert(
        'Không lấy được vị trí hiện tại',
        'Chọn Làm mới để định vị vị trí',
        [
          {
            text: 'Bỏ qua',
            onPress: () => { setIsLoading(false); },
          },
          {
            text: 'Làm mới',
            onPress: () => { requestLocationPermission() },
          },
        ],
        { cancelable: false },
      );
      return
    } else {
      const newDocRef = await firestore().collection('fl_content').add({});
      dispatch(updateReadyProviderRef(newDocRef));
      requestLocationPermission()
    }
  }

  async function getAddress(latitude, longitude) {
    Geocoder.init(configs.AppDefines.GOOGLE_API_KEY);
    Geocoder.from(latitude, longitude)
      .then((json) => {
        let addressComponent = json.results[0].address_components;
        setTimeout(() => {
          setAddress(getNameAddress(addressComponent));
          setIsLoading(false);
        }, 0);
      })
      .catch((error) => console.warn(error));
  }

  function getNameAddress(address) {
    let add = '';
    for (let i = 0; i < address.length; i++) {
      add += address[i].long_name + ', ';
    }
    return add.slice(0, -2);
  }

  function cancleReady() {
    if (readyProviderRef)
      readyProviderRef
        .delete()
        .then(() => console.log('Delete Ready Record OK!!'));
  }

  const genfl_meta = (uid, docId) => {
    const time = firestore.Timestamp.fromDate(new Date());
    let data = {
      createdBy: uid ? uid : '',
      createdDate: time,
      docId: docId,
      env: 'production',
      fl_id: docId,
      //  lastModifiedBy: uid ? uid : 'abc',
      //  lastModifiedDate: Date.now(),
      locale: 'vi',
      schema: 'readyProviders',
      schemaRef: firestore().doc('fl_content/' + 'D8qrXuioCpn44PGdXuR5'),
      schemaType: 'collection',
    };
    return data;
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <BaseScreen
      isToolbar={false}
      titleScreen="Nhà cung cấp"
      isMenuLeft={!loading}
      nameMenuLeft={'list'}
      onPressMenuLeft={openDrawer}
      isScroll={false}
      style={{ paddingHorizontal: 0, backgroundColor: '#F2F2F2', paddingTop: 0 }}>
      <View style={styles.container}>
        {!loading && (
          <View style={styles.viewContent}>
            <TouchableOpacity
              onPress={openDrawer}
              style={[styles.buttonIcon, {
                left: 16
              }]}>
              <Icon
                name={'list'}
                size={20}
                color='#fff'
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                let phoneNumber = '';
                if (Platform.OS === 'android') {
                  phoneNumber = `tel:${cshn?.hotline}`;
                } else {
                  phoneNumber = `telprompt:${cshn?.hotline}`;
                }
                Linking.openURL(phoneNumber);
              }}
              style={[styles.buttonIcon, {
                backgroundColor: configs.Colors.danger
              }]}>
              <Icon
                name={'phone'}
                size={20}
                color='#fff'
              />
            </TouchableOpacity>

            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ height: '80%', width: '100%', marginBottom: 14 }}
              region={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              <Marker
                coordinate={{
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              />
            </MapView>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: -8, alignSelf: 'center' }}>
              <Label title={userInfo.nhaCungCap?.tenNhaCungCap} styles={{ fontSize: 18, textTransform: 'uppercase' }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, alignSelf: 'center' }}>
              {/* <Label title={'Cơ sở hành nghề: '} /> */}
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 10
              }}>{cshn?.tenThongDung}</Text>
            </View>
            {!!isLoading ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={configs.Colors.primary} />
              </View>
              :
              <Button
                title="Sẵn sàng tiếp nhận"
                onPress={() => {
                  updateReady();
                }}
                styles={{
                  shadowOffset: {
                    width: 1,
                    height: 2,
                  },
                  shadowOpacity: 0.35,
                  shadowRadius: 1.8,
                  width: '94%',
                  marginHorizontal: '3%',
                  marginBottom: 30
                }}
                disabled={!!isLoading}
              />
            }
          </View>
        )}
        {loading && (
          <View style={styles.viewCenter}>
            <TouchableOpacity
              onPress={() => {
                let phoneNumber = '';
                if (Platform.OS === 'android') {
                  phoneNumber = `tel:${cshn?.hotline}`;
                } else {
                  phoneNumber = `telprompt:${cshn?.hotline}`;
                }
                Linking.openURL(phoneNumber);
              }}
              style={[styles.buttonIcon, {
                backgroundColor: configs.Colors.danger
              }]}>
              <Icon
                name={'phone'}
                size={20}
                color='#fff'
              />
            </TouchableOpacity>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ height: '80%', width: '100%', marginBottom: 14 }}
              region={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              <Marker
                coordinate={{
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              />
            </MapView>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: -8 }}>
              <Label title={userInfo.nhaCungCap?.tenNhaCungCap} styles={{ fontSize: 18, textTransform: 'uppercase' }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              {/* <Label title={'Cơ sở hành nghề: '} /> */}
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 10
              }}>{cshn?.tenThongDung}</Text>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 23,
                backgroundColor: configs.Colors.danger,
                shadowOffset: {
                  width: 1,
                  height: 2,
                },
                shadowOpacity: 0.35,
                shadowRadius: 1.8,
                flexDirection: 'row',
                paddingHorizontal: 16
              }}
              onPress={() => {
                cancleReady();
              }}
            >
              <Text style={{
                fontSize: 16, color: 'white', fontWeight: 'bold', textTransform: 'uppercase',
                paddingVertical: 14,
                paddingRight: 8
              }}>Hủy sẵn sàng</Text>
              <ActivityIndicator
                size={'small'}
                color={configs.Colors.white}
                style={{
                  shadowOffset: {
                    width: 1,
                    height: 2,
                  },
                  shadowOpacity: 0.35,
                  shadowRadius: 1.8
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BaseScreen>
  );
}
