import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, TouchableOpacity, Text, Platform, Linking, ScrollView, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../configs';
import { Label } from './index';
import * as configs from '../configs';

export default function ThongTinNCC({ nhaCungCap, position, danhGia, updateDanhGia, videoCall }) {
  const navigation = useNavigation()

  const [isLoading, setIsLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [danhGiaNew, setDanhGiaNew] = useState(danhGia)
  const callShowMap = () => {
    setShowMap(!showMap);
  };

  useEffect(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setDanhGiaNew(danhGia)
  }, [danhGia])

  useEffect(() => {
    updateDanhGia(danhGiaNew)
  }, [danhGiaNew])

  const goiNCC = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${nhaCungCap.phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${nhaCungCap.phoneNumber}`;
    }
    Linking.openURL(phoneNumber);
  };
  return (
    <View style={{ height: 500, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', padding: 8, }}>
      {
        isLoading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.success} />
          </View>
          : <>
            <View style={{ width: 100, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
              <Image
                source={!!nhaCungCap && !!nhaCungCap.avatarBase64 ? { uri: `data:image/png;base64,${nhaCungCap.avatarBase64}`, }
                  : { uri: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png' }}
                style={{
                  borderRadius: 50,
                  width: 100,
                  height: 100,
                }}
              />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
              <View style={{ justifyContent: 'center', marginTop: 20, }}>
                {/*<Label styles={{ fontSize: 16, fontWeight: 'bold' }} title="" />*/}
                {nhaCungCap && <Label title={nhaCungCap.tenNhaCungCap} />}
              </View>
              <View style={{ justifyContent: 'center', paddingTop: 8 }}>
                <Label title={nhaCungCap.khoangCach} />
              </View>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {nhaCungCap.dichVuDuocCapPhep &&
                  nhaCungCap.dichVuDuocCapPhep.length > 0 &&
                  !!nhaCungCap.dichVuDuocCapPhep[0].soChungChi &&
                  <View style={{ justifyContent: 'center' }}>
                    <Label title={nhaCungCap.dichVuDuocCapPhep[0].soChungChi} />
                  </View>
                }
                {nhaCungCap.coSoDangKyHanhNghe &&
                  <View style={{ justifyContent: 'center' }}>
                    <Label title={nhaCungCap.coSoDangKyHanhNghe?.tenThongDung} />
                  </View>
                }
                {!!nhaCungCap.kinhNghiem &&
                  <View style={{ justifyContent: 'center' }}>
                    <Label
                      title="Kinh nghiệm công tác"
                      styles={styles.title}
                    />
                    <Label title={nhaCungCap.kinhNghiem} styles={{ fontSize: 16, fontWeight: '300' }} />
                  </View>
                }
                {!!nhaCungCap.daoTao &&
                  <View style={{ justifyContent: 'center' }}>
                    <Label
                      title="Quá trình đào tạo"
                      styles={styles.title}
                    />
                    <Label title={nhaCungCap.daoTao} styles={{ fontSize: 16, fontWeight: '300' }} />
                  </View>
                }
              </ScrollView>
              <View style={{ paddingHorizontal: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                  <AntDesignIcon name='frowno' size={18} color={'#e55d4b'} />
                  <AntDesignIcon name='smileo' size={18} color={'#2ba56a'} />
                </View>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={-13}
                  maximumValue={-1}
                  minimumTrackTintColor={danhGiaNew <= -10 ? '#e55d4b' : -10 < danhGiaNew && danhGiaNew <= -6 ? '#fed922' : '#2ba56a'}
                  maximumTrackTintColor={'#6a6a6a'}
                  thumbTintColor={danhGiaNew <= -10 ? '#e55d4b' : -10 < danhGiaNew && danhGiaNew <= -6 ? '#fed922' : '#2ba56a'}
                  onSlidingComplete={value => {
                    setDanhGiaNew(value)
                  }}
                  step={1}
                  value={danhGiaNew}
                />
              </View>
            </View>

            {nhaCungCap.trangThaiXuLy != '7' &&
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.danger,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 23,
                    marginRight: 10
                  }}
                  onPress={goiNCC}
                >
                  <Text style={{
                    fontSize: 14, color: '#fff', fontWeight: '500', textTransform: 'uppercase',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                  }}>Gọi điện</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.bluegreen,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 23,
                    marginRight: 10
                  }}
                  onPress={videoCall}
                >
                  <Text style={{
                    fontSize: 14, color: '#fff', fontWeight: '500', textTransform: 'uppercase',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                  }}>Gọi video</Text>
                </TouchableOpacity>
                {/*<TouchableOpacity
                style={{
                  backgroundColor: Colors.success,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 23,
                }}
                onPress={callShowMap}
              >
                <Text style={{
                  fontSize: 14, color: '#fff', fontWeight: '500', textTransform: 'uppercase',
                  paddingVertical: 8,
                  paddingHorizontal: 14
                }}>Xem vị trí</Text>
              </TouchableOpacity>*/}
              </View>
            }
            {/*{showMap &&
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{ height: 150, width: '100%', paddingHorizontal: 10, paddingVertical: 10, marginBottom: 10 }}
                region={{
                  latitude: position?.lat,
                  longitude: position?.lng,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: position?.lat,
                    longitude: position?.lng,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                />
              </MapView>
            }*/}
          </>
      }

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
