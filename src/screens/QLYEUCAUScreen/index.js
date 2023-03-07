import React, { useEffect, useRef } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  BackHandler,
} from 'react-native';
import * as configs from '../../configs';
import {
  BaseScreen,
  Button,
  DoiNCCDen,
  DoiNCCTiepNhan,
  DangTienHanh,
  XacNhanNCC,
} from '../../components';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';

export default function QLYEUCAUScreen({ route, navigation }) {
  const [trangThaiXuLy, setTrangThaiXuLy] = useState('-1');
  const [thongTinYeuCau, setThongTinYeuCau] = useState(null);
  const [yeuCau, setYeuCau] = useState(null);
  const { yeuCauId } = route.params;

  useEffect(() => {
    const subscriber = firestore()
      .collection('fl_content')
      .doc(yeuCauId)
      .onSnapshot((documentSnapshot) => {
        const yeuCau = documentSnapshot.data();
        if (yeuCau && yeuCau.trangThaiXuLy != '5') {
          yeuCau.phienKham?.onSnapshot(async (documentSnapshot) => {
            const phienKham = documentSnapshot.data();
            if (phienKham.ketThuc == 1) {
              navigation.navigate('YeuCauDichVuScreen');
            }
          });
          setYeuCau(yeuCau);
          setTrangThaiXuLy(yeuCau.trangThaiXuLy);
        } else {
          navigation.goBack();
        }
      });

    return () => subscriber();
  }, [yeuCauId, trangThaiXuLy]);

  return (
    <BaseScreen
      isToolbar={false}
      style={trangThaiXuLy == 1 || trangThaiXuLy == 2 ? { backgroundColor: configs.Colors.agree, paddingHorizontal: 0, paddingTop: 0 } : { backgroundColor: "#e0e0e2", paddingHorizontal: 0, paddingTop: 8 }}
      titleScreen=""
      isMenuLeft={false}
      isScroll={false}>
      {yeuCau?.phienKham && trangThaiXuLy == 2 ?
        <DangTienHanh
          navigation={navigation}
          yeuCauId={yeuCauId}
          yeuCau={yeuCau}
        /> : trangThaiXuLy == 2 && (
          <XacNhanNCC
            navigation={navigation}
            yeuCauId={yeuCauId}
            yeuCau={yeuCau}
          />
        )}
      {yeuCau?.phienKham && trangThaiXuLy == 1 ?
        <DangTienHanh
          navigation={navigation}
          yeuCauId={yeuCauId}
          yeuCau={yeuCau}
        /> : trangThaiXuLy == 1 && (
          <DoiNCCTiepNhan navigation={navigation} yeuCauId={yeuCauId} />
        )
      }
      {trangThaiXuLy == 3 && (
        <DangTienHanh
          navigation={navigation}
          yeuCauId={yeuCauId}
          yeuCau={yeuCau}
        />
      )}
      {trangThaiXuLy == 4 && (
        <DangTienHanh
          navigation={navigation}
          yeuCauId={yeuCauId}
          yeuCau={yeuCau}
        />
      )}
      {trangThaiXuLy == 7 && (
        <DangTienHanh
          navigation={navigation}
          yeuCauId={yeuCauId}
          yeuCau={yeuCau}
        />
      )}
    </BaseScreen>
  );
}
