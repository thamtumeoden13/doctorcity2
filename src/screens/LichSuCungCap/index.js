import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BaseScreen, Label } from '../../components';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../../configs';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

export default function LichSuCungCap({ navigation }) {
  const user = useSelector((state) => state.authReducer.userInfo);
  const [isLoading, setIsLoading] = useState(true);

  const [dichVu, setDichVu] = useState(false);

  const backPressed = () => {
    navigation.goBack();
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const ncc = await firestore()
      .collection('fl_content')
      .doc(user.id);
    let dsYeuCau = await firestore()
      .collection('fl_content')
      .where('_fl_meta_.schema', '==', 'request')
      .where('nhaCungCap', '==', ncc)
      .where('trangThaiXuLy', 'in', ['ĐỒNG Ý', '1', '2', '3', '4', '5', '6', '7'])
      .orderBy('_fl_meta_.createdDate', 'desc')
      .get();

    let yeuCauDV = [];
    if (dsYeuCau.size > 0) {
      for (let i = 0; i < dsYeuCau.size; i++) {
        let yc = dsYeuCau.docs[i].data();
        let obj = yc;
        const khachHang = await yc.khachHang.get();
        if (yc.nhaCungCap) {
          const nhaCungCap = await yc.nhaCungCap.get();
          obj.nhaCungCap = nhaCungCap.data();
        } else {
          obj.nhaCungCap = null;
        }
        if (yc.phienKham) {
          const phienKham = await yc.phienKham.get();
          obj.phienKham = phienKham.data();
        } else {
          obj.phienKham = null;
        }
        const dichVu = await yc.dichVu.get();
        obj.khachHang = khachHang.data();
        obj.dichVu = dichVu.data();
        yeuCauDV.push(obj);
      }
    }
    setDichVu(yeuCauDV);
    setIsLoading(false);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={index} style={{
        backgroundColor: Colors.bgBlack, borderRadius: 8, padding: 10, marginBottom: 15,
        shadowOffset: {
          width: 1,
          height: 2,
        },
        shadowOpacity: 0.35,
        shadowRadius: 1.8,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Label styles={{ fontSize: 16, lineHeight: 19, fontWeight: '600' }} title={item?.dichVu?.tenDichVu} />
          <Label styles={{ fontSize: 14, lineHeight: 19, fontWeight: '600' }} title={item.phienKham?.maPhienKham} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="user" size={16}
            color="black" style={{ marginBottom: 10, marginRight: 8 }}
          />
          <Label styles={{ fontSize: 16, lineHeight: 19, fontWeight: 'normal' }} title={item?.khachHang ? item.khachHang?.displayName : ''} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            marginTop: 10,
          }}>
          <View style={{ borderRadius: 15, alignSelf: 'flex-end' }}></View>
          <View style={{ borderRadius: 15, alignSelf: 'flex-end' }}>
            <Text style={{ fontSize: 14, color: 'white', fontStyle: 'italic' }}>{moment(item.thoiDiemTao).format("DD/MM/YYYY")}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BaseScreen
      isToolbar={true}
      titleScreen="Lịch sử cung cấp dịch vụ"
      isMenuLeft
      nameMenuLeft={'chevron-left'}
      onPressMenuLeft={backPressed}
      style={{ paddingHorizontal: 0 }}
    >
      <View style={{ paddingHorizontal: 10, backgroundColor: Colors.white, flex: 1, paddingBottom: 20 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) :
          <FlatList
            data={dichVu}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 15, paddingHorizontal: 5 }}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={10}
          />
        }
      </View>
    </BaseScreen>
  );
}