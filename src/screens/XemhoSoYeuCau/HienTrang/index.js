import React, { useEffect, useRef, useState, memo } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import * as configs from '../../../configs';
import { Label } from '../../../components/index';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { formatMoney } from '../../../utils/function';

const HienTrang = ({ readyProvider, phienKhamRef, onSetBadge }) => {
  console.log('render-HienTrang')
  const timeoutChange = useRef(null)

  const [dichVu, setDichVu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
  }, [])

  useEffect(() => {
    if (!!phienKhamRef) {
      try {

        const subscriber = firestore()
          .collection('fl_content')
          .where('_fl_meta_.schema', '==', 'request')
          .where('phienKham', '==', phienKhamRef)
          .orderBy('_fl_meta_.createdDate', 'desc')
          .onSnapshot(async (documentSnapshot) => {
            console.log('onSnapshot-4', documentSnapshot.size)
            if (documentSnapshot.size > 0) {
              let reads = documentSnapshot.docs.map(async (doc) => {
                let yeuCau = doc.data()
                let obj = yeuCau;
                const khachHang = await yeuCau.khachHang.get();
                if (yeuCau.nhaCungCap) {
                  const nhaCungCap = await yeuCau.nhaCungCap.get();
                  obj.nhaCungCap = nhaCungCap.data();
                } else {
                  obj.nhaCungCap = null;
                }
                const dichVu = await yeuCau.dichVu.get();
                obj.khachHang = khachHang.data();
                obj.dichVu = dichVu.data();
                return { ...obj }
              })
              const yeuCauDV = await Promise.all(reads)
              setDichVu(yeuCauDV)
              setIsLoading(false)
              if (timeoutChange.current) {
                clearTimeout(timeoutChange.current)
              }
              timeoutChange.current = setTimeout(() => {
                if (onSetBadge) {
                  onSetBadge('dichVu', yeuCauDV.length)
                }
              }, 300);
            } else {
              setDichVu([])
              setIsLoading(false)
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
        setIsLoading(false)
      }
    }
  }, [phienKhamRef])

  const handleYeuCauDichVu = async (item, index) => {
    setIsLoading(true);
    const rq = await readyProvider.request.get();
    if (rq.data()?.mainRequest) {
      firestore()
        .doc('fl_content/' + item.id)
        .update({
          trangThaiXuLy: 'ĐỒNG Ý',
          change: item.id.concat('-0'),
          mainRequest: rq.data()?.mainRequest,
        })
        .then(() => {
          firestore()
            .doc('fl_content/' + rq.data().mainRequest)
            .update({
              change: item.id.concat('-0'),
              mainRequest: rq.data()?.mainRequest,
            }).then(() => {
              // onRefresh();
            });
        })
        .catch((error) => {
          console.log('error: ', error);
          setIsLoading(false);
        });
    } else {
      firestore()
        .doc('fl_content/' + item.id)
        .update({
          trangThaiXuLy: 'ĐỒNG Ý',
          change: item.id.concat('-0'),
          mainRequest: rq.id,
        })
        .then(() => {
          firestore()
            .doc('fl_content/' + rq.id)
            .update({
              change: item.id.concat('-0'),
              mainRequest: rq.id,
            }).then(() => {
              // onRefresh();
              // setIsLoading(false);
            });
        })
        .catch((error) => {
          console.log('error: ', error);
          setIsLoading(false);
        });
    }

  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: configs.Colors.bgBlack, borderRadius: 8, padding: 10, marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
          <Label styles={{ fontSize: 18, fontWeight: "600", color: '#fff', flex: 1 }} title={item.dichVu?.tenDichVu} />
          <Label styles={{ fontSize: 16, fontWeight: "600", minWidth: 96 }} title={!!item.dichVu?.price ? formatMoney(item.dichVu.price, 0) + ' VNĐ' : ''} />
        </View>
        {!!item.nhaCungCap?.nhaCungCap?.tenNhaCungCap &&
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <Icon name="id-card-alt" size={18}
              color="black" style={{ marginBottom: 5, marginRight: 8 }}
            />
            <Label styles={{ fontSize: 16, fontWeight: "500" }} title={item.nhaCungCap?.nhaCungCap?.tenNhaCungCap} />
          </View>}
        <View style={{ flexDirection: 'row', alignItems: "center" }}>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            marginTop: 10,
          }}>
          {item.trangThaiXuLy === 'ĐỀ XUẤT' ?
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginTop: 8,
            }}>
              <TouchableOpacity
                style={[{
                  backgroundColor: configs.Colors.agree,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 16,
                  paddingHorizontal: 16,
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
                }}>{`Đồng ý`}</Text>
              </TouchableOpacity>
            </View> :
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginTop: 10,
              marginTop: 10,
            }}>
            </View>
          }
          {
            item?.trangThaiXuLy === '4' || item?.trangThaiXuLy === '5' ?
              <View style={{ borderRadius: 15, alignSelf: 'flex-end' }} >
                <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic' }}>Đang thực hiện</Text>
              </View> :
              item?.trangThaiXuLy === '1' ?
                <View style={{ borderRadius: 15, alignSelf: 'flex-end' }} >
                  <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic' }}>Chờ tiếp nhận</Text>
                </View> : item?.trangThaiXuLy === '2' ? <View style={{ borderRadius: 15, alignSelf: 'flex-end' }} >
                  <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic' }}>Chờ chấp nhận</Text>
                </View> : item?.trangThaiXuLy === '3' ? <View style={{ borderRadius: 15, alignSelf: 'flex-end' }} >
                  <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic' }}>Chờ NCC đến</Text>
                </View> : item?.trangThaiXuLy === '7' ? <View style={{ borderRadius: 15, alignSelf: 'flex-end' }} >
                  <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic' }}>Đã hoàn thành</Text>
                </View> : <View style={{ borderRadius: 15, alignSelf: 'flex-end', }} >
                  <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic' }}>{item?.trangThaiXuLy}</Text>
                </View>
          }
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {isLoading ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={configs.Colors.blue} />
        </View>
        :
        <>
          {!!dichVu && dichVu.length > 0 ?
            <FlatList
              data={dichVu}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.txtTop}>Không có dịch vụ</Text>
            </View>
          }
        </>
      }
    </View>
  );
};

export default memo(HienTrang);