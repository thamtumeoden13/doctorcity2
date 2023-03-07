import React, { useEffect, useRef } from 'react';
import {
  View,
  Alert,
  TextInput,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  Text,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import * as configs from '../../configs';
import { BaseScreen, Label, Button } from '../../components';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request } from 'react-native-permissions';

import { formatNumberMoney } from '../../common/ultils';
import { useSelector } from 'react-redux';
import Geocoder from 'react-native-geocoding';
import styles from './styles';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

export default function YeuCauDichVuScreen({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [danhSachLoaiDV, setDanhSachLoaiDV] = useState([]);
  const [loaiDichVu, setLoaiDichVu] = useState(null);
  const [danhSachMucDoDV, setDanhSachMucDoDV] = useState([]);
  const [TTMDDV, setTTMDDV] = useState([]);
  const [mucDoDichVu, setMucDoDichVu] = useState(null);
  const [priceService, setPriceService] = useState(0);
  const [motaDichVu, setMotaDichVu] = useState(null);
  const [thongTinDichVu, setThongTinDichVu] = useState(null);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [state, setState] = useState({
    diaChi: '',
    modalDichVu: false,
    modalChatLuong: false,
    hotline: configs.AppDefines.SDT_TT_NCC,
  });
  const userInfo = useSelector((state) => state.authReducer.userInfo);

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
    setIsLoading(true)
    setIsLoadingButton(false)
    layDanhSachLoaiDV()
    checkYeuCauTonTai();
    requestLocationPermission()

    return () => backHandler.remove();
  }, [navigation]);

  const layDanhSachLoaiDV = async () => {
    firebase
      .firestore()
      .collection('fl_content')
      .where('_fl_meta_.schema', '==', 'ichi')
      .where('_fl_meta_.locale', '==', 'vi')
      .get()
      .then((querySnapshot) => {
        let DSLDV = [];
        querySnapshot.forEach((documentSnapshot) => {
          let dv = {
            label: documentSnapshot.data().tenThongThuong,
            value: documentSnapshot.data().id,
          };
          DSLDV.push(dv);
        });
        setDanhSachLoaiDV(DSLDV);
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkYeuCauTonTai = async () => {
    const fl_content_ref = firebase.firestore().collection('fl_content');
    if (userInfo && userInfo.id) {
      const userRef = fl_content_ref.doc(userInfo.id);
      // let dsYeuCau = await firestore()
      //   .collection('fl_content')
      //   .where('_fl_meta_.schema', '==', 'request')
      //   .where('khachHang', '==', userRef)
      //   .where('trangThaiXuLy', '!=', '5')
      //   .get();

      let phienKham = await firestore()
        .collection('fl_content')
        .where('_fl_meta_.schema', '==', 'phienKham')
        .where('khachHang', '==', userRef)
        // .where('ketThuc', '!=', '1')
        // .orderBy('_fl_meta_.createdDate', 'desc')
        .get();
      const dsPhienKham = phienKham.docs.find(doc => { return doc.data().ketThuc == undefined || doc.data().ketThuc != 1 })
      if (!!dsPhienKham && Object.keys(dsPhienKham).length > 0) {
        let dsYeuCau = await firestore()
          .collection('fl_content')
          .where('_fl_meta_.schema', '==', 'request')
          .where('phienKham', '==', dsPhienKham.ref)
          .where('trangThaiXuLy', 'in', ['ĐỒNG Ý', '1', '2', '3', '4', '5', '6', '7'])
          .orderBy('_fl_meta_.createdDate', 'desc')
          .get();

        // const xxxx = dsYeuCau.docs.map(e => {
        //   return {
        //     ...e.data()
        //   }
        // })
        // console.log('xxxx', xxxx)
        setIsLoading(false)
        if (dsYeuCau.size > 0) {
          let yeuCau = dsYeuCau.docs[0].data();
          navigation.navigate('QLYEUCAUScreen', { yeuCauId: yeuCau.id });
        }
      } else {
        let dsYeuCau = await firestore()
          .collection('fl_content')
          .where('_fl_meta_.schema', '==', 'request')
          .where('khachHang', '==', userRef)
          .where('trangThaiXuLy', 'in', ['1', '2', '3', '4',])
          .get();
        // const yyyy = dsYeuCau.docs.map(e => {
        //   return {
        //     ...e.data()
        //   }
        // })
        // console.log('yyyy', yyyy)
        setIsLoading(false)
        if (dsYeuCau.size > 0) {
          let yeuCau = dsYeuCau.docs[0].data();
          navigation.navigate('QLYEUCAUScreen', { yeuCauId: yeuCau.id });
        }
      }
    }
  };

  const requestLocationPermission = async (isADD) => {
    if (Platform.OS === 'ios') {
      const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (response === 'granted') {
        localCurrentPosition(isADD)
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
        setIsLoading(false);
      }
    }
    else {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (response === 'granted') {
        localCurrentPosition(isADD)
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
        setIsLoading(false);
      }
    }
  }

  const localCurrentPosition = async (isADD) => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
          setIsLoading(false);
          if (!!isADD) {
            navigateQLYEUCAU(position.coords.latitude, position.coords.longitude)
          }
        },
        (error) => {
          console.log(error.code, error.message);
          setIsLoading(false);
          if (!!isADD) {
            Alert.alert(
              'Không lấy được vị trí hiện tại',
              'Chọn Làm mới để định vị vị trí',
              [
                {
                  text: 'Bỏ qua',
                  onPress: () => { setIsLoadingButton(false) },
                },
                {
                  text: 'Làm mới',
                  onPress: () => { requestLocationPermission(isADD) },
                },
              ],
              { cancelable: false },
            );
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function getAddress(latitude, longitude) {
    Geocoder.init(configs.AppDefines.GOOGLE_API_KEY);
    Geocoder.from(latitude, longitude)
      .then((json) => {
        let addressComponent = json.results[0].address_components;
        setTimeout(() => {
          // setDiaChi(getNameAddress(addressComponent));
          layDanhSachLoaiDV();
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
  const getMucDoDichVu = async (loaiDichVu) => {
    const fl_content_ref = firebase.firestore().collection('fl_content');
    const loaiDichVuRef = fl_content_ref.doc(loaiDichVu);
    let snap_result = await fl_content_ref
      .where('_fl_meta_.schema', '==', 'services')
      .where('ichi', '==', loaiDichVuRef)
      .where('_fl_meta_.locale', '==', 'vi')
      .where('_fl_meta_.status', '==', 'publish')
      .get();
    if (snap_result.size > 0) {
      let DSMDDV = [];
      let TTMDDV = [];
      snap_result.forEach((documentSnapshot) => {
        let mclArr = {
          id: documentSnapshot.data().id,
          data: documentSnapshot.data(),
        };
        let mcl = {
          label: documentSnapshot.data().tenDichVu,
          value: documentSnapshot.data().id,
        };
        DSMDDV.push(mcl);
        TTMDDV.push(mclArr);
      });
      setDanhSachMucDoDV(DSMDDV);
      setTTMDDV(TTMDDV);

      setMucDoDichVu(DSMDDV[0]);
    } else {
      setDanhSachMucDoDV([]);
      setTTMDDV([]);
    }
  };
  useEffect(() => {
    getMucDoDichVu(loaiDichVu?.value);
  }, [loaiDichVu]);

  const getThongTinYeuCauDV = async (mucDoDichVu) => {
    const dv = TTMDDV.find((dv) => dv.id == mucDoDichVu);
    if (dv) {
      // setMucDoDichVu(dv.data.id)
      setPriceService(dv.data.price);
      setMotaDichVu(dv.data.moTaDichVu);
      setThongTinDichVu(dv.data.thongTinDichVu)
    } else {
      setPriceService(0);
      setMotaDichVu(null);
      setThongTinDichVu(null)
    }
  };
  useEffect(() => {
    getThongTinYeuCauDV(mucDoDichVu?.value);
  }, [mucDoDichVu]);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const genfl_meta = (uid, docId) => {
    const time = firestore.Timestamp.fromDate(new Date());
    let data = {
      createdBy: uid ? uid : '',
      createdDate: time,
      docId: docId,
      env: 'production',
      fl_id: docId,
      lastModifiedBy: uid ? uid : 'abc',
      lastModifiedDate: Date.now(),
      locale: 'vi',
      schema: 'request',
      schemaRef: firestore().doc('fl_content/' + 'mCginNvnYJwGE0VQR92R'),
      schemaType: 'collection',
    };
    return data;
  };
  const validateYeuCau = () => {
    if (userInfo && userInfo.id && mucDoDichVu && state.diaChi) {
      return true;
    } else {
      return false;
    }
  };

  const handleYeuCauDichVu = async () => {
    setIsLoadingButton(true)
    if (userInfo) {
      if (!validateYeuCau()) {
        Alert.alert(
          'Thông báo',
          'Vui lòng cung cấp đủ thông tin về dịch vụ và vị trí của bạn.',
        );
        setIsLoadingButton(false)
      } else {
        if (lat == 0 && long == 0) {
          Alert.alert(
            'Không lấy được vị trí hiện tại',
            'Chọn Làm mới để định vị vị trí',
            [
              {
                text: 'Bỏ qua',
                onPress: () => { setIsLoadingButton(false) },
              },
              {
                text: 'Làm mới',
                onPress: () => { requestLocationPermission(true) },
              },
            ],
            { cancelable: false },
          );
        } else {
          navigateQLYEUCAU(lat, long)
        }
      }
    } else {
      Alert.alert(
        'Thông báo',
        'Yêu cầu dịch vụ không thành công, vui lòng khởi động lại ứng dụng.',
      );
      setIsLoadingButton(false)
    }
  };

  const handleHelp = async () => {
    setIsLoadingButton(true)
    if (userInfo) {
      if (lat == 0 && long == 0) {
        Alert.alert(
          'Không lấy được vị trí hiện tại',
          'Chọn Làm mới để định vị vị trí',
          [
            {
              text: 'Bỏ qua',
              onPress: () => { setIsLoadingButton(false) },
            },
            {
              text: 'Làm mới',
              onPress: () => { requestLocationPermission(true) },
            },
          ],
          { cancelable: false },
        );
      } else {
        const data = {
          trangThaiXuLy: '1',
          khachHang: firestore().doc('fl_content/' + userInfo.id),
          dichVu: firestore().doc('fl_content/0FI1hu2ts50U2P6vbQYB'),
          viTri: { address: state.diaChi, lat: lat, lng: long },
        };
        firestore()
          .collection('fl_content')
          .add(data)
          .then((result) => {
            console.log('added success!', result.id);
            result
              .update({
                _fl_meta_: genfl_meta(userInfo.id, result.id),
                id: result.id,
              })
              .then(() => {
                console.log('yeuCau: ', result.id);
                navigation.navigate('QLYEUCAUScreen', { yeuCauId: result.id, loaiDichVu: { label: 'Hỗ trợ yêu cầu dịch vụ', value: 'REzjZu0SP1Fj6faoEAvy' } });
                setTimeout(() => {
                  setIsLoadingButton(false)
                }, 500);
              });
          });
      }
    } else {
      Alert.alert(
        'Thông báo',
        'Yêu cầu dịch vụ không thành công, vui lòng khởi động lại ứng dụng.',
      );
      setIsLoadingButton(false)
    }
  }

  const _onChangeText = (value) => (evt) => {
    setState((state) => ({ ...state, [value]: evt }));
  };

  const _showModalDV = () => {
    setState((state) => ({ ...state, modalDichVu: !state.modalDichVu }));
  };

  const _showModalCL = () => {
    setState((state) => ({ ...state, modalChatLuong: !state.modalChatLuong }));
  };

  const _chonDichVu = (item) => () => {
    setLoaiDichVu(item);
    _showModalDV();
  };

  const _chonChatLuong = (item) => () => {
    setMucDoDichVu(item);
    _showModalCL();
  };

  const navigateQLYEUCAU = (lat, long) => {
    const data = {
      trangThaiXuLy: '1',
      khachHang: firestore().doc('fl_content/' + userInfo.id),
      dichVu: firestore().doc('fl_content/' + mucDoDichVu?.value),
      viTri: { address: state.diaChi, lat: lat, lng: long },
    };
    firestore()
      .collection('fl_content')
      .add(data)
      .then((result) => {
        console.log('added success!', result.id);
        result
          .update({
            _fl_meta_: genfl_meta(userInfo.id, result.id),
            id: result.id,
          })
          .then(() => {
            console.log('yeuCau: ', result.id);
            navigation.navigate('QLYEUCAUScreen', { yeuCauId: result.id, loaiDichVu });
            setTimeout(() => {
              setIsLoadingButton(false)
            }, 500);
          });
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

  const xemChiTiet = async () => {
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(thongTinDichVu, {
        // iOS Properties
        dismissButtonStyle: 'close',
        preferredBarTintColor: configs.Colors.agree,
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        preferredBarTintColor: configs.Colors.agree,
        secondaryToolbarColor: 'black',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,

        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right'
        },
      });
    }
    else Linking.openURL(thongTinDichVu);
  };

  return (
    <BaseScreen
      isToolbar={false}
      titleScreen=""
      isMenuLeft={true}
      nameMenuLeft={'list'}
      onPressMenuLeft={openDrawer}
      style={{ paddingHorizontal: 0, backgroundColor: '#F2F2F2', paddingTop: 0, paddingBottom: 0 }}
    >
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={configs.Colors.primary} />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <TouchableOpacity
            onPress={openDrawer}
            style={{
              borderRadius: 10,
              padding: 8,
              backgroundColor: configs.Colors.success,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 1,
              top: 35,
              left: 16,
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1.8,
            }}>
            <FontAwesome5Icons
              name={'list'}
              size={20}
              color='#fff'
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goTrungTam}
            style={{
              borderRadius: 10,
              padding: 8,
              backgroundColor: configs.Colors.danger,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 1,
              top: 35,
              right: 16,
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1.8,
            }}>
            <FontAwesome5Icons
              name={'phone'}
              size={20}
              color='#fff'
            />
            {/*
            style={{
              borderRadius: 10,
              padding: 8,
              backgroundColor: configs.Colors.red,
              width: 120,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 1,
              top: 35,
              right: 16,
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1.8,
            }}
          >
            <Text style={{ color: 'white' }}>{`Gọi khẩn cấp`}</Text>
          */}
          </TouchableOpacity>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 0.8, width: '100%', marginBottom: 14 }}
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
          <View style={[styles.whiteBox, { width: '100%', position: 'absolute', bottom: 0 }]}>
            <TouchableOpacity
              onPress={() => requestLocationPermission()}
            >
              <MaterialIcons
                name={'my-location'}
                size={32}
                color='#000'
                style={{ position: 'absolute', top: -64, right: 0 }}
              />
            </TouchableOpacity>
            <View style={{ marginBottom: 10 }}>
              <Label title="Loại dịch vụ" />
              <TouchableOpacity
                onPress={_showModalDV}
                style={styles.textInput}
              ><Text>{!loaiDichVu ? 'Chọn loại dịch vụ...' : loaiDichVu.label}</Text></TouchableOpacity>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Label title="Dịch vụ" />
              <TouchableOpacity
                onPress={_showModalCL}
                style={styles.textInput}
              ><Text>{!mucDoDichVu ? 'Chọn dịch vụ...' : mucDoDichVu.label}</Text></TouchableOpacity>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Label title="Số nhà" />
              <TextInput
                style={styles.textInput}
                placeholder="Tòa nhà - số nhà..."
                onChangeText={_onChangeText('diaChi')}
                value={state.diaChi}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Label
                title="Giá:"
                styles={styles.title}
              />
              <Label
                title={
                  priceService
                    ? formatNumberMoney(priceService) + ' VNĐ'
                    : 0 + ' VNĐ'
                }
                styles={styles.title}
              />
            </View>
            {!!motaDichVu &&
              <View
                style={{
                  flexDirection: 'column',
                  maxHeight: 96
                }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
                  <Label
                    title={motaDichVu}
                    styles={[styles.title, { fontWeight: '300' }]}
                  />
                  {!!thongTinDichVu &&
                    <TouchableOpacity
                      onPress={xemChiTiet}
                    >
                      <Label
                        title="Xem thêm"
                        styles={[styles.title, { fontStyle: 'italic', fontWeight: '300', color: configs.Colors.blue, width: '100%', textAlign: 'right' }]}
                      />
                    </TouchableOpacity>
                  }
                </ScrollView>
              </View>
            }
            {!!isLoadingButton ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={configs.Colors.primary} />
              </View>
              :
              <>
                {!!loaiDichVu ?
                  <Button
                    title="Đặt dịch vụ"
                    onPress={handleYeuCauDichVu}
                    disabled={!!isLoadingButton}
                  />
                  :
                  <Button
                    title="Yêu cầu hỗ trợ đặt dịch vụ"
                    onPress={handleHelp}
                    disabled={!!isLoadingButton}
                    styles={{ backgroundColor: configs.Colors.blue }}
                  />
                }
              </>
            }
          </View>
        </View>
      )
      }
      <Modal
        isVisible={state.modalDichVu}
        style={styles.modalFull}
        animationIn="slideInUp"
        hasBackdrop={true}
        backdropOpacity={0.6}
        onBackdropPress={_showModalDV}>
        <View style={{ backgroundColor: '#ffffff' }}>
          <ScrollView>
            {danhSachLoaiDV.map((item, index) => {
              return (
                <TouchableOpacity
                  key={`item_${index}`}
                  onPress={_chonDichVu(item)}
                  style={
                    {
                      padding: 13,
                      borderBottomWidth: 1,
                      borderColor: 'rgba(62, 62, 97, 0.4)',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }
                  }>
                  <Text style={{ fontSize: 13 }}>{(item).label}</Text>
                  {/* <FontAwesome5Icons
                    name={state.operations?.includes((item)?.id) ? 'check' : ''}
                    size={15}
                    color={Colors.Orange}
                  /> */}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
      <Modal
        isVisible={state.modalChatLuong}
        style={styles.modalFull}
        animationIn="slideInUp"
        hasBackdrop={true}
        backdropOpacity={0.6}
        onBackdropPress={_showModalCL}>
        <View style={{ backgroundColor: '#ffffff' }}>
          <ScrollView>
            {danhSachMucDoDV.map((item, index) => {
              return (
                <TouchableOpacity
                  key={`item_${index}`}
                  onPress={_chonChatLuong(item)}
                  style={
                    {
                      padding: 13,
                      borderBottomWidth: 1,
                      borderColor: 'rgba(62, 62, 97, 0.4)',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }
                  }>
                  <Text style={{ fontSize: 13 }}>{(item).label}</Text>
                  {/* <FontAwesome5Icons
                    name={state.operations?.includes((item)?.id) ? 'check' : ''}
                    size={15}
                    color={Colors.Orange}
                  /> */}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </BaseScreen >
  );
}