import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BaseScreen, Label } from '../../components';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../../configs';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

export default function LichSuPhienKham({ navigation }) {
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
    const kh = await firestore()
      .collection('fl_content')
      .doc(user.id);
    let dsYeuCau = await firestore()
      .collection('fl_content')
      .where('_fl_meta_.schema', '==', 'phienKham')
      .where('ketThuc', '==', '1')
      .where('khachHang', '==', kh)
      .orderBy('_fl_meta_.createdDate', 'desc')
      .get();
    let yeuCauDV = [];
    if (dsYeuCau.size > 0) {
      for (let i = 0; i < dsYeuCau.size; i++) {
        let yc = dsYeuCau.docs[i].data();
        let obj = yc;
        if (yc) {
          const chuyenVien = await yc.chuyenVien?.get();
          obj.chuyenVien = chuyenVien?.data() || null;
        } else {
          obj.chuyenVien = null;
        }
        if (yc) {
          const khachHang = await yc.khachHang?.get();
          obj.khachHang = khachHang?.data() || null;
        } else {
          obj.khachHang = null;
        }
        if (yc) {
          let arr = [];
          if (yc.ds_chan_doan?.length > 0)
            for (let i = 0; i < yc.ds_chan_doan?.length; i++) {
              const cd = await yc.ds_chan_doan[i].icd_ref.get();
              arr.push({
                uniqueKey: yc.ds_chan_doan[i].uniqueKey,
                icd: cd.data()
              });
            }
          obj.ds_chan_doan = arr;
        }

        yeuCauDV.push(obj);
      }
    }
    setDichVu(yeuCauDV);
    console.log('yeuCauDV', yeuCauDV)
    setIsLoading(false);
  };

  const goToDetail = (item) => () => {
    navigation.navigate('ChiTietPhienKham', {
      item
    });
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
      }} onPress={goToDetail(item)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Label styles={{ fontSize: 16, lineHeight: 19, fontWeight: '600' }} title={item?.maPhienKham} />
        </View>
        <Label
          title="Chẩn đoán"
          styles={{ marginBottom: 0, fontSize: 14 }}
        />
        {item.ds_chan_doan?.length > 0 ?
          <View style={[{
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: 10
          }]}>
            {item.ds_chan_doan?.map((item) => {
              return (
                <View key={item.id} style={{ paddingRight: 8, flexDirection: 'row', alignItems: 'center' }}>
                  <Text>- </Text>
                  <Text>{item?.icd?.tenChanDoan}</Text>
                </View>
              );
            })}
          </View>
          : null
        }
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            marginTop: 10,
          }}>
          <View style={{ borderRadius: 15, alignSelf: 'flex-end' }}></View>
          <View style={{ borderRadius: 15, alignSelf: 'flex-end' }}>
            <Text style={{ fontSize: 14, color: 'white', fontStyle: 'italic' }}>{moment(item?._fl_meta_?.createdDate).format("DD/MM/YYYY")}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BaseScreen
      isToolbar={true}
      titleScreen="Lịch sử phiên khám"
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
            keyExtractor={(item, index) => `${item.id.toString()}-${index.toString()}`}
            style={{ marginTop: 15, paddingHorizontal: 5 }}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={10}
          />
        }
      </View>
    </BaseScreen>
  );
}