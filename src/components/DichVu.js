import React, { useEffect, useRef, useState, memo } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, Alert, TouchableOpacity, Linking, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
// import GetLocation from 'react-native-get-location';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';

import { formatMoney, getDistance } from '../utils/function';
import { Label, Button } from '../components/index';
import * as configs from '../configs';
import ModalThongTinNCC from './ModalThongTinNCC';

const DichVu = ({ phienKhamRef, maPhienKham, trangThaiXuLy, diaChi, position, onSetBadge }) => {
  const navigation = useNavigation()

  const timeoutChange = useRef(null)

  const [isModalVisible, setModalVisible] = useState(false);
  const [thongTinNCC, setThongTinNCC] = useState({});
  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [contentID, setContentID] = useState('')
  const [danhGia, setDanhGia] = useState(5)
  const [loading, setLoading] = useState(false)
  const [dsdv, setDSDV] = useState([]);

  const validateYeuCau = () => {
    if (userInfo && userInfo.id) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setLoading(true)
    requestLocationPermission()
  }, []);

  useEffect(() => {
    if (!!phienKhamRef && !!maPhienKham && !!trangThaiXuLy) {
      try {
        const subscriber = firestore()
          .collection('fl_content')
          .where('_fl_meta_.schema', '==', 'request')
          .where('phienKham', '==', phienKhamRef)
          .where('trangThaiXuLy', 'in', trangThaiXuLy)
          .orderBy('_fl_meta_.createdDate', 'desc')
          .onSnapshot(async (documentSnapshot) => {
            if (documentSnapshot.size > 0) {
              let reads = documentSnapshot.docs.map(async (doc) => {
                let yc = doc.data();
                const pk = await yc.phienKham.get();
                if (pk.data().maPhienKham === maPhienKham) {
                  let obj = { ...yc };
                  const khachHang = await yc.khachHang.get();
                  if (yc.nhaCungCap) {
                    const nhaCungCap = await yc.nhaCungCap.get();
                    obj.nhaCungCap = nhaCungCap.data();
                    if (!!obj.nhaCungCap.nhaCungCap && !!obj.nhaCungCap.nhaCungCap.coSoDangKyHanhNghe) {
                      const csdk = await obj.nhaCungCap?.nhaCungCap?.coSoDangKyHanhNghe.get()
                      obj.nhaCungCap.coSoDangKyHanhNghe = csdk?.data()
                    }
                  } else {
                    obj.nhaCungCap = null;
                  }
                  const dichVu = await yc.dichVu.get();
                  const ncc_phu_hop = !!yc.cac_ncc_phu_hop && yc.cac_ncc_phu_hop.length > 0 ? yc.cac_ncc_phu_hop : []
                  const ncc_dang_chon = !!yc.ncc_dang_chon ? yc.ncc_dang_chon : -1
                  let distance = 0
                  if (!!yc.viTri && !!yc.viTriNCC) {
                    const viTriKH = { lat: yc.viTri.lat, lng: yc.viTri.lng }
                    const viTriNCC = { lat: yc.viTriNCC.lat, lng: yc.viTriNCC.lng }
                    distance = getDistance(viTriNCC, viTriKH)
                  }
                  obj.khachHang = khachHang.data();
                  obj.dichVu = dichVu.data();
                  obj.khoangCach = `${distance > 0 ? Math.round(distance / 1000) : 0} km`
                  obj.ncc_phu_hop = ncc_phu_hop
                  obj.ncc_dang_chon = ncc_dang_chon
                  return { ...obj }
                }
              })
              const yeuCauDV = await Promise.all(reads)
              setDSDV(yeuCauDV)
              setLoading(false)
              if (timeoutChange.current) {
                clearTimeout(timeoutChange.current)
              }
              timeoutChange.current = setTimeout(() => {
                if (onSetBadge) {
                  onSetBadge('dichVu', yeuCauDV.length)
                }
              }, 300);
            } else {
              setDSDV([])
              setLoading(false)
              if (timeoutChange.current) {
                clearTimeout(timeoutChange.current)
              }
              timeoutChange.current = setTimeout(() => {
                if (onSetBadge) {
                  onSetBadge('dichVu', 0)
                }
              }, 300);
            }
          });
        return () => subscriber()
      } catch (error) {
        setLoading(false)
      }
    }
  }, [phienKhamRef])

  const requestLocationPermission = async (isAdd, item) => {
    if (Platform.OS === 'ios') {
      const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (response === 'granted') {
        localCurrentPosition(isAdd, item)
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
      }
    }
    else {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (response === 'granted') {
        localCurrentPosition(isAdd, item)
      } else {
        Alert.alert('Cho phép ứng dụng truy cập vị trí để trải nghiệm tốt hơn.');
      }
    }
  }

  const localCurrentPosition = async (isAdd, item) => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
          if (!!isAdd) {
            updateTrangThaiXuLy(position.coords.latitude, position.coords.longitude, item)
          }
        },
        (error) => {
          console.log(error.code, error.message);
          if (!!isAdd) {
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
                  onPress: () => { requestLocationPermission(isAdd, item) },
                },
              ],
              { cancelable: false },
            )
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      Alert.alert('Không thể xác định được vị trí của bạn');
      console.log(error);
    }
  }

  const handleYeuCauDichVu = (item, index) => {
    if (userInfo) {
      if (!validateYeuCau()) {
        Alert.alert(
          'Thông báo',
          'Vui lòng cung cấp đủ thông tin về dịch vụ và vị trí của bạn.',
        );
      } else {
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
                onPress: () => { requestLocationPermission(true, item) },
              },
            ],
            { cancelable: false },
          );
        } else {
          updateTrangThaiXuLy(lat, long, item)
        }
      }
    } else {
      Alert.alert(
        'Thông báo',
        'Yêu cầu dịch vụ không thành công, vui lòng khởi động lại ứng dụng.',
      );
    }
  };

  const updateTrangThaiXuLy = (lat, long, item) => {
    firestore()
      .doc('fl_content/' + item.id) // đổi lại bằng yeuCauId
      .update({
        trangThaiXuLy: '1',
        change: item.id.concat('-1'),
        viTri: {
          address: diaChi, lat: lat, lng: long
        },
        khachHang: firestore().doc('fl_content/' + userInfo.id),
      })
      .then(() => {
        firestore()
          .doc('fl_content/' + item.mainRequest)
          .update({
            change: item.id.concat('-1'),
          })
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  }

  const handleTuChoi = async (item, index) => {
    const request = (await firestore().doc('fl_content/' + item.id).get()).data();
    firestore()
      .doc('fl_content/' + item.id)
      .update({ trangThaiXuLy: 'TỪ CHỐI', nhaCungCap: null })
      .then(() => {
        firestore()
          .doc('fl_content/' + item.mainRequest)
          .update({
            change: item.id,
          })
        // onRefresh();
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  const handleHuyChoNCC = async (item, index) => {
    const request = (await firestore().doc('fl_content/' + item.id).get()).data();
    firestore()
      .doc('fl_content/' + item.id)
      .update({
        trangThaiXuLy: 'ĐỒNG Ý',
        change: item.id.concat('-0'),
        cac_ncc_phu_hop: firestore.FieldValue.delete(),
        ncc_dang_chon: firestore.FieldValue.delete(),
        thoiDiemTao: firestore.FieldValue.delete(),
        ds_phien_san_sang_da_tu_choi: firestore.FieldValue.delete(),
        khoangCach: firestore.FieldValue.delete(),
        viTri: firestore.FieldValue.delete(),
      })
      .then(() => {
        firestore()
          .doc('fl_content/' + item.mainRequest)
          .update({
            change: item.id.concat('-0'),
          })
        if (
          request.cac_ncc_phu_hop &&
          request.cac_ncc_phu_hop.length > 0 &&
          request.ncc_dang_chon > -1
        ) {
          const readyProviderRef = request.cac_ncc_phu_hop[request.ncc_dang_chon].ready_ref;
          if (readyProviderRef) {
            firestore()
              .doc('fl_content/' + readyProviderRef.id)
              .update({ request: null, trangThaiXuLy: '1' })
              .then()
              .catch((error) => {
                console.log('Cập nhật readyProviderRef thất bại', error);
              });
          }
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  const handleTuChoiNCC = async (item, index) => {
    console.log('item', item)
    const request = (await firestore().doc('fl_content/' + item.id).get()).data();
    firestore()
      .doc('fl_content/' + item.id)
      .update({
        trangThaiXuLy: '1',
        change: item.id.concat('-1'),
        nhaCungCap: null,
        readyProviderRef: null
      })
      .then(() => {
        firestore()
          .doc('fl_content/' + item.mainRequest)
          .update({
            change: item.id.concat('-1'),
          })
        if (
          request.cac_ncc_phu_hop &&
          request.cac_ncc_phu_hop.length > 0 &&
          request.ncc_dang_chon > -1
        ) {
          const readyProviderRef = request.cac_ncc_phu_hop[request.ncc_dang_chon].ready_ref;
          if (readyProviderRef) {
            firestore()
              .doc('fl_content/' + readyProviderRef.id)
              .update({ request: null, trangThaiXuLy: '1' })
              .then()
              .catch((error) => {
                console.log('Cập nhật readyProviderRef thất bại', error);
              });
          }
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  const handleYeuCauNCC = (item, index) => {
    firestore()
      .doc('fl_content/' + item.id)
      .update({
        trangThaiXuLy: '3',
        change: item.id.concat('-3'),
        viTri: {
          address: diaChi,
          lat: lat, lng: long
        },
      })
      .then(() => {
        firestore()
          .doc('fl_content/' + item.mainRequest)
          .update({
            change: item.id.concat('-3'),
          })
        item.readyProviderRef?.update({ trangThaiXuLy: '4' })
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  const _showNCC = async (item) => {
    console.log('item', item)
    const phienKham = await item.phienKham.get()
    if (phienKham?.data()?.ketThuc == 1) {
      return
    }
    let obj = {
      tenNhaCungCap: item.nhaCungCap.nhaCungCap?.tenNhaCungCap,
      dichVuDuocCapPhep: item.nhaCungCap.nhaCungCap?.dichVuDuocCapPhep,
      phoneNumber: item.nhaCungCap.phoneNumber,
      avatarBase64: item.nhaCungCap.avatarBase64,
      diaChi: item.nhaCungCap.diaChi,
      khoangCach: item.khoangCach,
      roomId: `${item.khachHang.id}-${item.nhaCungCap.id}`,
      token: item.nhaCungCap.notificationToken,
      displayName: item.khachHang.displayName,
      trangThaiXuLy: item.trangThaiXuLy
    };
    obj.coSoDangKyHanhNghe = item.nhaCungCap?.coSoDangKyHanhNghe;
    obj.kinhNghiem = item.nhaCungCap?.kinhNghiem;
    obj.daoTao = item.nhaCungCap?.daoTao;
    setThongTinNCC(obj);
    setModalVisible(!isModalVisible);
    setContentID(item.id)
    setDanhGia(!!item.danhGia1 ? item.danhGia1 * -1 : -5)
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => _showNCC(item)} key={index} style={{
        backgroundColor: configs.Colors.bgWhite, borderRadius: 8, padding: 10, marginBottom: 15,
        shadowOffset: {
          width: 1,
          height: 2,
        },
        shadowOpacity: 0.35,
        shadowRadius: 1.8,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Label styles={{ fontSize: 16, lineHeight: 19, fontWeight: '600', color: '#fff', width: '70%' }} title={item?.dichVu?.tenDichVu} />
          <Label styles={{ fontSize: 14, lineHeight: 19, fontWeight: '600', color: '#000' }} title={!!item.dichVu?.price ? formatMoney(item.dichVu?.price, 0) + ' VNĐ' : ''} />
        </View>
        {!!item.nhaCungCap && !!item.nhaCungCap.nhaCungCap &&
          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#e0e0e2', borderRadius: 8 }}>
            <View style={{
              flexDirection: 'column',
              width: 88,
              height: 88,
              justifyContent: 'center', alignItems: 'center',
              padding: 8
            }}>
              <Image
                source={!!item.nhaCungCap && !!item.nhaCungCap.avatarBase64 ? { uri: `data:image/png;base64,${item.nhaCungCap.avatarBase64}`, }
                  : { uri: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png' }}
                style={{
                  borderRadius: 8,
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'column', height: 88, padding: 8, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Icon name="id-card-alt" size={16}
                  color="black" style={{ marginBottom: 10, marginRight: 8 }}
                /> */}
                <Label
                  styles={{ fontSize: 18, lineHeight: 20, fontWeight: '500', color: '#000' }}
                  title={!!item.nhaCungCap.nhaCungCap?.tenNhaCungCap ? item.nhaCungCap.nhaCungCap?.tenNhaCungCap : ''}
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Icon name="clinic-medical" size={16}
                  color="black" style={{ marginBottom: 10, marginRight: 8 }}
                /> */}
                <Label
                  styles={{ fontSize: 16, lineHeight: 18, fontWeight: '400', color: '#000' }}
                  title={item?.nhaCungCap && item.nhaCungCap?.coSoDangKyHanhNghe ? item.nhaCungCap.coSoDangKyHanhNghe?.tenThongDung : ''}
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Icon name="location-arrow" size={16}
                  color="black" style={{ marginBottom: 10, marginRight: 8 }}
                /> */}
                <Label
                  styles={{ fontSize: 14, lineHeight: 16, fontWeight: '300', color: '#000' }}
                  title={item?.khoangCach ? item.khoangCach : ''}
                />
              </View>
            </View>
          </View>
        }
        {(item?.trangThaiXuLy === 'ĐỀ XUẤT' || item?.trangThaiXuLy == 'ĐỒNG Ý' || item?.trangThaiXuLy == '1' || item?.trangThaiXuLy == '2') &&
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            marginTop: 10,
          }}>
            {(item?.trangThaiXuLy === 'ĐỀ XUẤT' || item?.trangThaiXuLy === 'ĐỒNG Ý') &&
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 10,
                marginTop: 10,
                flex: 1,
              }}>
                <TouchableOpacity
                  style={[{
                    backgroundColor: configs.Colors.danger,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 23,
                    paddingHorizontal: 13,
                    marginRight: 10,
                    shadowOffset: {
                      width: 1,
                      height: 3,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 1.8,
                  }]}
                  onPress={() => handleTuChoi(item, index)}
                >
                  <Text style={{
                    fontSize: 16, color: '#fff', fontWeight: 'normal',
                    paddingVertical: 7
                  }}>{`Từ chối`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[{
                    backgroundColor: configs.Colors.agree,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 23,
                    paddingHorizontal: 13,
                    shadowOffset: {
                      width: 1,
                      height: 3,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 1.8,
                  }]}
                  onPress={() => handleYeuCauDichVu(item, index)}
                >
                  <Text style={{
                    fontSize: 16,
                    color: '#fff',
                    fontWeight: 'normal',
                    paddingVertical: 7
                  }}>{`Đặt dịch vụ`}</Text>
                </TouchableOpacity>
              </View>
            }
            {item?.trangThaiXuLy === '1' &&
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 10,
                marginTop: 10,
                flex: 1,
              }}>
                <TouchableOpacity
                  style={[{
                    backgroundColor: configs.Colors.danger,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 23,
                    paddingHorizontal: 13,
                    marginRight: 10,
                    shadowOffset: {
                      width: 1,
                      height: 3,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 1.8,
                  }]}
                  onPress={() => handleHuyChoNCC(item, index)}
                >
                  <Text style={{
                    fontSize: 16, color: '#fff', fontWeight: 'normal',
                    paddingVertical: 7
                  }}>{`Dừng yêu cầu`}</Text>
                </TouchableOpacity>
              </View>
            }
            {item?.trangThaiXuLy === '2' &&
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 10,
                marginTop: 10,
                flex: 1,
              }}>
                <TouchableOpacity
                  style={[{
                    backgroundColor: configs.Colors.danger,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 23,
                    paddingHorizontal: 13,
                    marginRight: 10,
                    shadowOffset: {
                      width: 1,
                      height: 3,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 1.8,
                  }]}
                  onPress={() => handleTuChoiNCC(item, index)}
                >
                  <Text style={{
                    fontSize: 16,
                    color: '#fff',
                    fontWeight: 'normal',
                    paddingVertical: 7
                  }}>{`Từ chối`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[{
                    backgroundColor: configs.Colors.agree,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 23,
                    paddingHorizontal: 13,
                    shadowOffset: {
                      width: 1,
                      height: 3,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 1.8,
                  }]}
                  onPress={() => handleYeuCauNCC(item, index)}
                >
                  <Text style={{
                    fontSize: 16, color: '#fff', fontWeight: 'normal',
                    paddingVertical: 7
                  }}>{`Chấp nhận`}</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        }
        {(item?.trangThaiXuLy == '3' || item?.trangThaiXuLy == '4' || item?.trangThaiXuLy == '5' || item?.trangThaiXuLy == '7') &&
          <View style={{ paddingVertical: 8 }}>
            {(item?.trangThaiXuLy == '3') &&
              <View style={{ borderRadius: 15, alignSelf: 'flex-end' }} >
                <Text style={{ fontSize: 16, color: '#000', fontStyle: 'italic' }}>{`Đang di chuyển`}</Text>
              </View>
            }
            {(item?.trangThaiXuLy == '4' || item?.trangThaiXuLy == '5') &&
              <View style={{ borderRadius: 15, alignSelf: 'flex-end' }} >
                <Text style={{ fontSize: 16, color: '#000', fontStyle: 'italic' }}>{`Đang thực hiện`}</Text>
              </View>
            }
            {item?.trangThaiXuLy == '7' &&
              <View style={{ borderRadius: 15, alignSelf: 'flex-end' }} >
                <Text style={{ fontSize: 16, color: '#000', fontStyle: 'italic' }}>{`Đã hoàn thành`}</Text>
              </View>
            }
          </View>
        }
      </TouchableOpacity>
    );
  };

  const goiNCC = () => {
    let phoneNumber = '';
    // if (Platform.OS === 'android') {
    //   phoneNumber = `tel:${configs.AppDefines.SDT_KHAN_CAP}`;
    // } else {
    //   phoneNumber = `telprompt:${configs.AppDefines.SDT_KHAN_CAP}`;
    // }
    Linking.openURL(phoneNumber);
  };

  const updateDanhGia = (danhGiaNew) => {
    firestore()
      .doc('fl_content/' + contentID)
      .update({
        // danhGia: Math.round(danhGiaNew * 13),
        danhGia1: danhGiaNew * -1,
      })
      // .then(() => {
      //   onRefresh();
      // })
      .catch((error) => {
        console.log('error: ', error);
      });
    setDanhGia(danhGiaNew * -1)
  }

  const videoCall = () => {
    console.log('thongTinNCC', thongTinNCC)
    navigation.navigate('VideoCallModal',
      {
        roomId: thongTinNCC.roomId,
        token: thongTinNCC.token,
        displayName: thongTinNCC.displayName
      }
    )
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#e0e0e2',
      paddingTop: 16,
      paddingHorizontal: 8
    }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={configs.Colors.blue} />
        </View>
      ) :
        <>
          <FlatList
            data={dsdv}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id}
            style={{ marginTop: 15, paddingHorizontal: 5 }}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={10}
          />
          <ModalThongTinNCC
            nhaCungCap={thongTinNCC}
            isModalVisible={isModalVisible}
            setModalVisible={setModalVisible}
            goiNCC={goiNCC}
            position={position}
            danhGia={danhGia}
            updateDanhGia={updateDanhGia}
            videoCall={videoCall}
          />
        </>}
    </View>
  );
}

export default memo(DichVu)