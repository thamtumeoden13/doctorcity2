import React, { useEffect } from 'react';
import {
  View,
  Image,
  Linking,
  StyleSheet,
  Platform,
  BackHandler,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import * as configs from '../configs';
import { Button, Label } from './index';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function XacNhanNCC({
  navigation,
  yeuCauId = null,
  yeuCau = null,
}) {
  const [nhaCungCap, setNhaCungCap] = useState(null);
  const [cshn, setCSHN] = useState(null);
  const [tenDichVu, setTenDichVu] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    if (!!yeuCau) {
      getThongTinNCC();
    }
  }, [yeuCau]);

  useEffect(() => {
    function backAndroid() {
      handleTuChoi();
      return true;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAndroid,
    );
    return () => backHandler.remove();
  }, [navigation]);

  const getThongTinNCC = async () => {
    let dichVuYeuCau = null;
    const dataDichVu = await yeuCau.dichVu.get();

    if (dataDichVu.data()) {
      setTenDichVu(dataDichVu.data().tenDichVu);
      dichVuYeuCau = dataDichVu.data()?.id;
    } else {
      alert('Không tìm thấy dịch vụ');
    }

    const dataNhaCungCap = await yeuCau.nhaCungCap.get();
    console.log(dataNhaCungCap.data())
    if (dataNhaCungCap) {
      setNhaCungCap(
        dataNhaCungCap.data().nhaCungCap ? dataNhaCungCap.data() : null,
      );
      const dataCSDK = await dataNhaCungCap.data().nhaCungCap.coSoDangKyHanhNghe?.get();
      if (dataCSDK) {
        setCSHN(dataCSDK.data());
      }
    } else {
      alert('Không tìm thấy nhà cung cấp');
    }
  };

  const handleChapNhan = async () => {
    if (yeuCau?.phienKham) {
      firestore()
        .doc('fl_content/' + yeuCau?.id)
        .update({ trangThaiXuLy: '3', phienKham: yeuCau?.phienKham });
    } else {
      firestore()
        .doc('fl_content/' + yeuCau?.id)
        .update({ trangThaiXuLy: '3' });
    }
  };
  const handleTuChoi = async () => {
    firestore()
      .doc('fl_content/' + yeuCau.id)
      .update({ trangThaiXuLy: '1', nhaCungCap: null })
      .then((result) => {
        console.log('result: ', result);
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F2F2F2',
        paddingTop: 0
      }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ height: '40%', width: '100%', paddingHorizontal: 15, paddingVertical: 10, marginBottom: 14 }}
        region={{
          latitude: !!yeuCau?.viTriNCC?.lat ? yeuCau?.viTriNCC?.lat : yeuCau?.viTri?.lat,
          longitude: !!yeuCau?.viTriNCC?.lng ? yeuCau?.viTriNCC?.lng : yeuCau?.viTri?.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          coordinate={{
            latitude: !!yeuCau?.viTriNCC?.lat ? yeuCau?.viTriNCC?.lat : yeuCau?.viTri?.lat,
            longitude: !!yeuCau?.viTriNCC?.lng ? yeuCau?.viTriNCC?.lng : yeuCau?.viTri?.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        />
      </MapView>
      <View style={{ paddingHorizontal: 15, justifyContent: 'flex-end', flex: 1 }}>
        <ScrollView>
          <View style={{
            padding: 11,
            backgroundColor: '#ffffff',
            borderRadius: 10,
          }}>
            <View>
              <Label styles={{ fontSize: 16, fontWeight: "bold" }} title="Dịch vụ" />
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 23,
                backgroundColor: "#F4F5F6",
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 10
              }}>
                <Icon
                  name={"briefcase-medical"}
                  size={16}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  value={tenDichVu}
                  editable={false}
                />
              </View>
            </View>
            <View>
              <Label styles={{ fontSize: 16, fontWeight: "bold" }} title="Khoảng cách" />
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 23,
                backgroundColor: "#F4F5F6",
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 10
              }}>
                <Icon
                  name={"road"}
                  size={16}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  value={`${yeuCau?.cac_ncc_phu_hop[yeuCau.ncc_dang_chon]?.khoang_cach / 1000} km`}
                  editable={false}
                />
              </View>
            </View>
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
              onPress={toggleModal}
            >
              <Image
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 10,
                }}
                resizeMode="cover"
                source={!!nhaCungCap && !!nhaCungCap.avatarBase64 ? { uri: `data:image/png;base64,${nhaCungCap.avatarBase64}`, }
                  : { uri: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png' }}
              />
              <View style={{ marginLeft: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: "center", flexWrap: 'wrap' }}>
                  {nhaCungCap && <Label styles={{ fontSize: 16, fontWeight: "600", marginBottom: 0, textTransform: 'uppercase' }} title={nhaCungCap.nhaCungCap?.tenNhaCungCap} />}
                </View>
                {nhaCungCap && nhaCungCap.nhaCungCap?.dichVuDuocCapPhep &&
                  <View style={{ flexDirection: 'row', alignItems: "center", flexWrap: 'wrap' }}>
                    <Label styles={{ fontSize: 14, fontWeight: "500", marginBottom: 0 }} title="" />
                    {nhaCungCap && <Label styles={{ fontSize: 14, fontWeight: "500", marginBottom: 0 }} title={nhaCungCap.nhaCungCap?.dichVuDuocCapPhep[0]?.soChungChi} />}
                  </View>
                }
                {cshn &&
                  <View style={{ flexDirection: 'row', alignItems: "center", flexWrap: 'wrap' }}>
                    <Label styles={{ fontSize: 14, fontWeight: "500", marginBottom: 0 }} title="" />
                    {nhaCungCap && <Label styles={{ fontSize: 14, fontWeight: "500", marginBottom: 0 }} title={cshn?.tenThongDung} />}
                  </View>
                }
              </View>
            </TouchableOpacity>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  flex: 1,
                }}>
                <Button
                  styles={{
                    backgroundColor: configs.Colors.danger,
                    marginVertical: 15,
                    paddingHorizontal: 15,
                    flex: 1 / 2,
                    marginRight: 10
                  }}
                  title="Từ chối"
                  onPress={handleTuChoi}
                />
                <Button
                  styles={{
                    backgroundColor: configs.Colors.bgBlack,
                    marginVertical: 15,
                    paddingHorizontal: 15,
                    flex: 1 / 2
                  }}
                  title="Chấp nhận"
                  onPress={handleChapNhan}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        backdropOpacity={0.6}
      >
        {!!isModalVisible &&
          <View style={{
            backgroundColor: '#fff', minHeight: '50%', maxHeight: '80%',
            padding: 18, alignItems: 'center', borderRadius: 18
          }}>
            <TouchableOpacity style={{
              position: 'absolute', zIndex: 1, top: 15, right: 20
            }}
              onPress={toggleModal}
            >
              <Icon
                name={'times'}
                size={25}
                style={{ color: '#000' }}
              />
            </TouchableOpacity>
            <View style={{ height: 500, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', padding: 8, }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', marginTop: 20, }}>
                  {nhaCungCap && <Label title={nhaCungCap.tenNhaCungCap} />}
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  {!!nhaCungCap.kinhNghiem &&
                    <View style={{ justifyContent: 'center' }}>
                      <Label
                        title="Kinh nghiệm công tác"
                        styles={{ marginBottom: 0, textAlign: "center" }}
                      />
                      <Label title={nhaCungCap.kinhNghiem} styles={{ fontSize: 16, fontWeight: '300' }} />
                    </View>
                  }
                  {!!nhaCungCap.daoTao &&
                    <View style={{ justifyContent: 'center', marginTop: 4 }}>
                      <Label
                        title="Quá trình đào tạo"
                        styles={{ marginBottom: 0, textAlign: "center" }}
                      />
                      <Label title={nhaCungCap.daoTao} styles={{ fontSize: 16, fontWeight: '300' }} />
                    </View>
                  }
                </ScrollView>
              </View>
            </View>
          </View>
        }
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  viewHeader: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: 'blue',
    paddingBottom: 5
  },
  box: {
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    marginLeft: 100,
    padding: 5,
    marginHorizontal: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    backgroundColor: configs.Colors.agree,
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'green',
  },
});
