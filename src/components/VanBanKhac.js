import React, { memo, useState, useEffect, useRef } from 'react';
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import * as configs from "../configs";

const VanBanKhac = ({ phienKhamRef, maPhienKham, }) => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false)
  const [phienKham, setPhienKham] = useState(null)
  const [dsdv, setDSDV] = useState([]);
  const [dsCanLamSang, setDSCanLamSang] = useState([])
  const [dsPhieuKetQua, setDSPhieuKetQua] = useState('')

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    if (!!phienKhamRef) {
      try {
        const subscriber = phienKhamRef?.onSnapshot(async (snap) => {
          if (snap) {
            const phienKham = snap.data()
            setPhienKham(phienKham)

            let dsCanLamSang = [];
            if (phienKham.canLamSang) {
              for (let i = 0; i < phienKham.canLamSang.length; i++) {
                const item = phienKham.canLamSang[i];
                const chiSoData = await item.chiSo.get();
                dsCanLamSang.push({
                  ...item,
                  chiSoData: chiSoData.data(),
                });
              }
            }
            dsCanLamSang.sort((a, b) => a.chiSoData.maChiSo > b.chiSoData.maChiSo ? 1
              : a.chiSoData.maChiSo == b.chiSoData.maChiSo ?
                (!b.thoiGian || new Date(a.thoiGian).getTime() > new Date(b.thoiGian).getTime()) ? 1 : -1 : -1)

            setDSCanLamSang(dsCanLamSang);
            setLoading(false)
          }
        });
        return () => {
          subscriber()
        }
      } catch (error) {
        setLoading(false)
      }
    }
  }, [phienKhamRef])

  useEffect(() => {
    if (!!phienKhamRef && maPhienKham) {
      const subscriber = firestore()
        .collection('fl_content')
        .where('_fl_meta_.schema', '==', 'request')
        .where('phienKham', '==', phienKhamRef)
        .where('trangThaiXuLy', 'in', ['ĐỀ XUẤT', 'ĐỒNG Ý', '1', '2', '3', '4', '5', '6', '7'])
        .orderBy('_fl_meta_.createdDate', 'desc')
        .onSnapshot(async (documentSnapshot) => {
          if (documentSnapshot.size > 0) {
            let reads = documentSnapshot.docs.map(async (doc) => {
              let yc = doc.data();
              const pk = await yc.phienKham.get();
              if (pk.data().maPhienKham === maPhienKham) {
                let obj = { ...yc };
                const khachHang = await yc.khachHang.get();
                if (yc.nhaCungCap) {
                  const nhaCungCap = await yc.nhaCungCap.get();
                  obj.nhaCungCap = nhaCungCap.data();
                  if (!!obj.nhaCungCap.nhaCungCap && !!obj.nhaCungCap.nhaCungCap.coSoDangKyHanhNghe) {
                    const csdk = await obj.nhaCungCap?.nhaCungCap?.coSoDangKyHanhNghe.get()
                    obj.nhaCungCap.coSoDangKyHanhNghe = csdk?.data()
                  }
                } else {
                  obj.nhaCungCap = null;
                }
                const dichVu = await yc.dichVu.get();
                const ncc_phu_hop = !!yc.cac_ncc_phu_hop && yc.cac_ncc_phu_hop.length > 0 ? yc.cac_ncc_phu_hop : []
                const ncc_dang_chon = !!yc.ncc_dang_chon ? yc.ncc_dang_chon : -1
               
                obj.khachHang = khachHang.data();
                obj.dichVu = dichVu.data();
                obj.ncc_phu_hop = ncc_phu_hop
                obj.ncc_dang_chon = ncc_dang_chon
                return { ...obj }
              }
            })
            const yeuCauDV = await Promise.all(reads)
            setDSDV(yeuCauDV)
          } else {
            setDSDV([])
          }
        });
      return () => {
        subscriber()
      }
    }
  }, [phienKhamRef, maPhienKham])

  useEffect(() => {
    if (!phienKham) return

    const getDsPhieuKetQua = () => {
      const reference = storage().ref(`mobileUpload/${phienKham.maPhienKham}/`);
      let dsPhieuKetQua = []
      reference.list().then(async (result) => {
        const reads = result.items.map(async (ref) => {
          const fileName = ref.name
          const fullPath = ref.fullPath
          const downloadURL = await storage().ref(fullPath).getDownloadURL();
          const metaData = await ref.getMetadata();
          const re = /(?:\.([^.]+))?$/
          const ext = re.exec(fileName)[1] || ' '
          console.log({ ext })
          return {
            downloadURL: downloadURL,
            fileName: fileName,
            size: `${parseFloat(metaData.size / 1024 / 1024).toFixed(2)}(MB)`,
            ext: ext
          }
        });
        dsPhieuKetQua = await Promise.all(reads)
        console.log({ dsPhieuKetQua })
        setDSPhieuKetQua(dsPhieuKetQua)
      });
    }

    getDsPhieuKetQua()

  }, [phienKham])

  return (
    <View style={{
      backgroundColor: '#e0e0e2',
      paddingTop: 32,
      paddingHorizontal: 8,
      flex: 1
    }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={configs.Colors.blue} />
        </View>
      ) :
        <>
          <TouchableOpacity style={{
            backgroundColor: configs.Colors.bgBlack,
            borderRadius: 8,
            paddingVertical: 16,
            paddingHorizontal: 10,
            marginBottom: 15,
            marginHorizontal: 2,
            shadowOffset: {
              width: 1,
              height: 2,
            },
            shadowOpacity: 0.35,
            shadowRadius: 1.8,
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
          }} onPress={() => {
            navigation.navigate("HoaDon", { dsdv });
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '500',
              color: '#fff',
              paddingVertical: 8
            }}>{`Hóa đơn`}</Text>
            <Icon name="angle-right" size={30}
              color="white" style={{ padding: 8 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: configs.Colors.bgBlack,
            borderRadius: 8,
            paddingVertical: 16,
            paddingHorizontal: 10,
            marginBottom: 15,
            marginHorizontal: 2,
            shadowOffset: {
              width: 1,
              height: 2,
            },
            shadowOpacity: 0.35,
            shadowRadius: 1.8,
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
          }} onPress={() => {
            navigation.navigate("CanLamSang", { dsCanLamSang });
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '500',
              color: '#fff',
              paddingVertical: 8
            }}>{`Thăm dò cận lâm sàng`}</Text>
            <Icon name="angle-right" size={30}
              color="white" style={{ padding: 8 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{
            backgroundColor: configs.Colors.bgBlack,
            borderRadius: 8,
            paddingVertical: 16,
            paddingHorizontal: 10,
            marginBottom: 15,
            marginHorizontal: 2,
            shadowOffset: {
              width: 1,
              height: 2,
            },
            shadowOpacity: 0.35,
            shadowRadius: 1.8,
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
          }} onPress={() => {
            navigation.navigate("PhieuKetQua", { dsPhieuKetQua });
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '500',
              color: '#fff',
              paddingVertical: 8
            }}>{`Phiếu kết quả`}</Text>
            <Icon name="angle-right" size={30}
              color="white" style={{ padding: 8 }}
            />
          </TouchableOpacity>
        </>
      }
    </View>
  );
}

export default memo(VanBanKhac)