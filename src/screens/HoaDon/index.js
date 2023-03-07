import React, { useEffect, useRef, useMemo } from 'react';
import { useState } from 'react';
import { View, FlatList, Dimensions, Linking, Text, Alert, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, SafeAreaView, } from 'react-native';
import * as configs from "../../configs";
import { Label, BaseScreen } from '../../components/index';
import { useRoute } from '@react-navigation/native';
import styles from './styles';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { formatMoney } from '../../utils/function';

export default function HoaDon({ navigation }) {
  const [tongTien, setTongTien] = useState(0);
  const route = useRoute();
  const userInfo = useSelector((state) => state.authReducer.userInfo);

  const backPressed = () => {
    navigation.goBack();
  };

  const dsdv = (route.params) ? (route.params).dsdv : [];
  const dsdvThanhToan = useMemo(() => { return dsdv.filter(e => { return e.thanhToan }) }, [dsdv])

  useEffect(() => {
    if (!dsdv || dsdv.length <= 0) return

    const tinhTongTien = () => {
      let tongTien = 0;
      let chuaThanhToan = 0
      for (let i = 0; i < dsdv?.length; i++) {
        if (!!dsdv[i].thanhToan) {
          tongTien += dsdv[i].dichVu.price;
        }
        if (!dsdv[i].thanhToan && dsdv[i].trangThaiXuLy == "7") {
          chuaThanhToan += 1
        }
      }
      setTongTien(tongTien);

      if (chuaThanhToan > 0) {
        Alert.alert(
          `Bạn còn ${chuaThanhToan} dịch vụ chưa thanh toán!`,
          'Chọn Liên hệ hỗ trợ để được trợ giúp',
          [
            {
              text: 'Bỏ qua',
              onPress: () => { },
            },
            {
              text: 'Liên hệ hỗ trợ',
              onPress: () => {
                let phoneNumber = '';
                if (Platform.OS === 'android') {
                  phoneNumber = `tel:+842433119115`;
                } else {
                  phoneNumber = `telprompt:+842433119115`;
                }
                Linking.openURL(phoneNumber);
              },
            },
          ],
          { cancelable: false },
        );
      }
    };

    tinhTongTien();
  }, [dsdv]);

  return (
    <BaseScreen
      isToolbar={true}
      titleScreen="Hóa đơn"
      isMenuLeft
      nameMenuLeft={'chevron-left'}
      onPressMenuLeft={backPressed}
      style={{ paddingHorizontal: 0 }}
      isScroll={false}
    >
      <View style={{ backgroundColor: '#fff' }}>
        <View style={[styles.itemRow, { backgroundColor: '#fff', alignSelf: 'flex-end' }]}>
          <View style={[styles.itemRowColumn, { flexDirection: 'row' }]}>
            <Text style={[styles.itemRowHeader, { textAlign: 'right', paddingRight: 10, fontStyle: 'italic', fontWeight: '500' }]}>{moment(dsdv[0]?.thoiDiemTao).format('DD/MM/YYYY')}</Text>
          </View>
        </View>
      </View>
      <View>
        <View style={[styles.itemRow, { backgroundColor: '#fff', alignItems: 'flex-start' }]}>
          <View style={[styles.itemRowColumn, { width: '50%' }]}>
            <Text style={styles.itemRowHeader}>DoctorCity</Text>
            <Text style={[styles.itemRowHeader, {
              fontSize: 13, fontWeight: '300',
              paddingVertical: 0
            }]}>+842433119115</Text>
          </View>
          <View style={[styles.itemRowColumn, { width: '50%' }]}>
            <Text style={[styles.itemRowHeader, { textAlign: 'right', paddingRight: 10 }]}>Khách hàng</Text>
            <Text style={[styles.itemRowHeader, { textAlign: 'right', paddingRight: 10, fontSize: 13, fontWeight: '300', paddingVertical: 0 }]}>{userInfo.displayName}</Text>
            <Text style={[styles.itemRowHeader, { textAlign: 'right', paddingRight: 10, fontSize: 13, fontWeight: '300', paddingVertical: 0 }]}>{userInfo.phoneNumber}</Text>
          </View>
        </View>
      </View>
      <View style={{
        backgroundColor: '#fff', flex: 1,
        paddingTop: 12
      }}>
        <View style={{ flex: 1, paddingHorizontal: 8, }}>
          <View style={[styles.itemRow, { backgroundColor: '#DCDCDC' }]}>
            <View style={[styles.itemRowColumn, { width: '50%' }]}>
              <Text style={styles.itemRowHeader}>Dịch vụ</Text>
            </View>
            <View style={[styles.itemRowColumn, { width: '50%' }]}>
              <Text style={[styles.itemRowHeader, { textAlign: 'right', paddingRight: 10 }]}>Giá</Text>
            </View>
          </View>
          <FlatList
            data={dsdvThanhToan}
            keyExtractor={(item, index) => index.toString()}
            style={{ backgroundColor: '#fff', }}
            // contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            nestedScrollEnabled={true}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={{ paddingVertical: 4 }} >
                  <View
                    style={
                      index % 2 === 0
                        ? [styles.itemRow, { backgroundColor: '#fff' }]
                        : [styles.itemRow, { backgroundColor: '#F1F1F1' }]
                    }>
                    <View style={[styles.itemRowColumn, { width: '50%' }]}>
                      <Text style={[styles.itemRowDetail, { textAlign: 'justify', fontSize: 14 }]}>{item.dichVu?.tenDichVu}</Text>
                    </View>

                    <View style={[styles.itemRowColumn, { width: '50%' }]}>
                      <Text style={[styles.itemRowDetail, { textAlign: 'right', paddingRight: 10, fontSize: 14, }]}>{!!item.dichVu?.price ? formatMoney(item.dichVu?.price, 0) + ' VNĐ' : ''}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
          backgroundColor: configs.Colors.agree,
          // width: '100%',
          paddingBottom: 16,
        }}>
          <Text style={{ fontSize: 20, fontWeight: '700', padding: 8, }}>Tổng tiền: </Text>
          <Text style={{ fontSize: 20, fontWeight: '500', padding: 8, color: '#fff' }}>{formatMoney(tongTien, 0)} VNĐ</Text>
        </View>
      </View>
    </BaseScreen >
  );
}