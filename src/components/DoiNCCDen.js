import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  Platform,
  Linking,
  ActivityIndicator,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import * as configs from '../configs';
import { Button, Label, ThongTinNCC } from './index';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';

export default function DoiNCCDen({
  navigation,
  yeuCauId = null,
  yeuCau = null,
}) {
  const [nhaCungCap, setNhaCungCap] = useState(null);
  const [avtNCC, setAvtNCC] = useState(null);
  useEffect(() => {
    getThongTinNCC();
  }, [yeuCauId]);

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

  const getThongTinNCC = async () => {
    if (!yeuCau) {
      // alert('Không tìm thấy yêu cầu');
    } else {
      const dataNhaCungCap = await yeuCau.nhaCungCap.get();
      if (dataNhaCungCap) {
        setNhaCungCap(
          dataNhaCungCap.data().nhaCungCap ? dataNhaCungCap.data() : null,
        );
        let avt = await dataNhaCungCap.data().avatar;
        if (avt.length > 0) {
          setAvtNCC(
            'https://homepages.cae.wisc.edu/~ece533/images/arctichare.png',
          );
        } else {
        }
      } else {
        // alert('Không tìm thấy yêu cầu');
      }
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
    <SafeAreaView
      style={{
        flex: 1,
        margin: 12,
      }}>
      <Label
        styles={{ fontSize: 14, marginBottom: 30, textAlign: 'center' }}
        title="Nhà cung cấp đang di chuyển đến vị trí bạn yêu cầu"
      />
      <ThongTinNCC nhaCungCap={nhaCungCap ? nhaCungCap.nhaCungCap : null} />
      <View
        style={{ justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1 }}>
        <Button
          title="Gọi khẩn cấp"
          styles={[
            styles.button,
            { backgroundColor: configs.Colors.dark, marginBottom: 20 },
          ]}
          onPress={goiKhanCap}
        />
      </View>
    </SafeAreaView>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
