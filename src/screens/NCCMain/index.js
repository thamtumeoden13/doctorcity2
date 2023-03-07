import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import apiApp from '../../api/index';
import NCC from '../NCC';
import TiepNhanKhachHang from '../TiepNhanKhachHang';
import XemhoSoYeuCau from '../XemhoSoYeuCau';
import { updateReadyProvider, updateReadyProviderRef } from '../../actions';
import { View, ActivityIndicator, Text } from 'react-native';
export default function NCCMain({ route, navigation }) {
  const readyProvider = useSelector(
    (state) => state.commonReducer.readyProvider,
  );
  const readyProviderRef = useSelector(
    (state) => state.commonReducer.readyProviderRef,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!readyProviderRef)
      readyProviderRef.onSnapshot((snap) => {
        if (snap) {
          const data = snap.data();
          dispatch(updateReadyProvider(data));
        }
      });
  }, [readyProviderRef]);
  console.log('render-NCCMain');
  return (!readyProvider || Object.keys(readyProvider).length <= 0) ? (
    <NCC loading={false} navigation={navigation} />
  ) : readyProvider.trangThaiXuLy == '1' ? (
    <NCC navigation={navigation} loading={true} />
  ) : readyProvider.trangThaiXuLy == '2' ? (
    <TiepNhanKhachHang status={1} />
  ) : readyProvider.trangThaiXuLy == '3' ? (
    <TiepNhanKhachHang status={2} />
  ) : readyProvider.trangThaiXuLy == '4' ? (
    <TiepNhanKhachHang status={3} />
  ) : readyProvider.trangThaiXuLy == '5' ? (
    <XemhoSoYeuCau />
  ) : (
    <View>
      <Text>Trang thai xu ly hien tai: {readyProvider.trangThaiXuLy}</Text>
    </View>
  );
}
