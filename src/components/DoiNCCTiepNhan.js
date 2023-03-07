import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  Alert,
  Platform,
  ActivityIndicator,
  Linking,
  TextInput,
  BackHandler,
  ScrollView
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';

import * as configs from '../configs';
import { Button } from './index';
import { formatMoney } from '../utils/function';
import { BaseScreen, Label } from '../components';

export default function DoiNCCTiepNhan({ navigation, yeuCauId = null }) {

  const [dichVu, setDichVu] = useState(null)
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);

  useEffect(() => {
    function backAndroid() {
      handleHuyYeuCau();
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAndroid,
    );
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (!!yeuCauId) {
      let result = {}
      setTimeout(async () => {
        const request = (
          await firestore()
            .doc('fl_content/' + yeuCauId)
            .get()
        ).data();
        console.log('request', request)
        result.viTri = request.viTri
        if (!!request.dichVu) {
          const dichVu = (await request.dichVu.get()).data()
          result.tenDichVu = dichVu.tenDichVu
          result.giaDichVu = dichVu.price
          result.moTaDichVu = dichVu.moTaDichVu
        }
        console.log('result', result)
        setDichVu(result)
        setLat(result?.viTri?.lat || 0)
        setLong(result?.viTri?.lng || 0)
      });
    }
  }, [yeuCauId])

  const handleHuyYeuCau = async () => {
    if (yeuCauId) {
      const request = (
        await firestore()
          .doc('fl_content/' + yeuCauId)
          .get()
      ).data();

      firestore()
        .doc('fl_content/' + yeuCauId)
        .delete()
        .then(async (result) => {
          console.log('Hủy yêu cầu dịch vụ thành công');
          // cap nhap trang thai readyProviders
          if (
            request.cac_ncc_phu_hop &&
            request.cac_ncc_phu_hop.length > 0 &&
            request.ncc_dang_chon > -1
          ) {
            const readyProviderRef =
              request.cac_ncc_phu_hop[request.ncc_dang_chon].ready_ref;
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
          console.log(error);
          console.log('Hủy yêu cầu thất bại');
        });
    } else {
      alert('Hủy yêu cầu thất bại');
    }
  };

  const goiKhanCap = async () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${configs.AppDefines.SDT_KHAN_CAP}`;
    } else {
      phoneNumber = `telprompt:${configs.AppDefines.SDT_KHAN_CAP}`;
    }
    Linking.openURL(phoneNumber);
  };
  return (
    <BaseScreen
      isToolbar={false}
      style={{ paddingHorizontal: 0, backgroundColor: '#fff', paddingBottom: 0, marginBottom: 0 }}
    >
      <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 16, position: 'absolute', }}>
        <ScrollView
          // style={{ height: 120, }}
          contentContainerStyle={{ flexGrow: 1, width: '100%', }}
        >
          {!!dichVu &&
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <View style={{
                width: Dimensions.get('screen').width,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 16,
                paddingHorizontal: 8,
              }}>
                {!!dichVu.tenDichVu &&
                  <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', }}>
                    {/* <Label styles={{ width: 90, fontSize: 18, lineHeight: 20, fontWeight: '300', color: '#000' }} title={`Dịch Vụ: `} /> */}
                    <Label styles={{ flex: 1, fontSize: 18, lineHeight: 20, fontWeight: '500', color: '#000' }} title={dichVu.tenDichVu} />
                  </View>
                }
                {!!dichVu.moTaDichVu &&
                  <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', }}>
                    {/* <Label styles={{ width: 90, fontSize: 18, lineHeight: 20, fontWeight: '300', color: '#000' }} title={`Mô tả: `} /> */}
                    <Label styles={{ flex: 1, fontStyle: 'italic', fontSize: 16, lineHeight: 24, fontWeight: '400', color: '#000' }} title={dichVu.moTaDichVu} />
                  </View>
                }
                {!!dichVu.giaDichVu &&
                  <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', }}>
                    {/* <Label styles={{ width: 90, fontSize: 18, lineHeight: 20, fontWeight: '300', color: '#000' }} title={`Giá dv: `} /> */}
                    <Label styles={{ flex: 1, fontSize: 18, lineHeight: 20, fontWeight: '500', color: '#000' }} title={!!dichVu.giaDichVu && dichVu.giaDichVu > 0 ? formatMoney(dichVu.giaDichVu, 0) + ' VNĐ' : ''} />
                  </View>
                }
                {!!dichVu.viTri &&
                  <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', }}>
                    {/* <Label styles={{ width: 90, fontSize: 18, lineHeight: 20, fontWeight: '300', color: '#000' }} title={`Địa chỉ: `} /> */}
                    <Label styles={{ flex: 1, fontSize: 18, lineHeight: 20, fontWeight: '300', color: '#000' }} title={dichVu?.viTri?.address} />
                  </View>
                }
              </View>
            </View>
          }
        </ScrollView>
        {(!!lat || !!long) &&
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{
              // ...StyleSheet.absoluteFillObject,
              flex: 1,
              height: Dimensions.get('screen').height / 2 + 160, width: '100%', marginBottom: 0
            }}
            region={{
              latitude: lat, //vitri?.lat,
              longitude: long,//vitri?.lng,
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
        }
      </View>
      <View style={{
        // flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 0,
        backgroundColor: '#fff',
        position: 'absolute', bottom: 0, width: '100%'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Button
            title="Hủy yêu cầu"
            styles={[
              { backgroundColor: configs.Colors.danger, width: '40%', },
            ]}
            onPress={handleHuyYeuCau}
          />
          {/* <Button
            title="Gọi khẩn cấp"
            styles={[
              { backgroundColor: configs.Colors.dark, width: '40%' },
            ]}
            onPress={goiKhanCap}
          /> */}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 24 }}>
          <Text style={[{ color: '#000', fontSize: 18, lineHeight: 21, textAlignVertical: 'center' }]}>
            Đợi nhà cung cấp tiếp nhận...
          </Text>
          <ActivityIndicator size='large' color="#000" />
        </View>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3,
  },
  button: {
    width: 180,
    height: 60,
    backgroundColor: configs.Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
  },
  viewInfo: {
    paddingHorizontal: 16,
    // flex: 1,
    width: '100%',
    paddingVertical: 16,
  },
  viewLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  txtTitleTip: {
    fontSize: 16,
    fontWeight: '500'
  },
});
