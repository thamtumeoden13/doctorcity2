import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking, FlatList, ActivityIndicator } from 'react-native';
import * as configs from "../configs";
import { AppDimensions, Colors } from "../configs";
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

export default function SanPham({ phienKhamRef, onSetBadge }) {

  const timeoutChange = useRef(null)

  const [donThuoc, setDonThuoc] = useState([])
  const [soLuongThuoc, setSoLuongThuoc] = useState([])
  const [huongDanSuDung, setHuongDanSuDung] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    if (!!phienKhamRef) {
      try {
        const subscriber = phienKhamRef?.onSnapshot(async (snap) => {
          if (snap) {
            const phienKham = snap.data()

            let dsDonThuoc = [];
            let dsSoLuongThuoc = []
            let dsHuongDanSuDung = []
            if (phienKham.donThuoc) {
              for (let i = 0; i < phienKham.donThuoc?.length; i++) {
                let nhapThuoc = await phienKham.donThuoc[i]?.info.nhapThuoc.get();
                let duyetThuoc = phienKham.donThuoc[i]?.info.duyet;
                let soLuong = phienKham.donThuoc[i]?.info.soLuong;
                let huongDanSuDung = phienKham.donThuoc[i]?.info.huongDanSuDung;
                let donThuoc = { ...nhapThuoc.data(), duyet: '', nhaCungCap: '' }
                if (duyetThuoc == 'Duyệt') {
                  donThuoc.duyet = 'Duyệt'
                  donThuoc.nhaCungCap = phienKham.donThuoc[i]?.info.nhaCungCap
                }
                dsDonThuoc.push(donThuoc);
                dsSoLuongThuoc.push(soLuong + ' ' + nhapThuoc.data().dangDongGoi);
                dsHuongDanSuDung.push(huongDanSuDung)
              }
            }
            console.log({ dsDonThuoc })
            setDonThuoc(dsDonThuoc);
            setSoLuongThuoc(dsSoLuongThuoc);
            setHuongDanSuDung(dsHuongDanSuDung);
            setLoading(false)

            if (timeoutChange.current) {
              clearTimeout(timeoutChange.current)
            }
            timeoutChange.current = setTimeout(() => {
              if (onSetBadge) {
                onSetBadge('donThuoc', dsDonThuoc.length)
              }
            }, 300);
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

  const xemChiTiet = (item) => async () => {
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(item.thongTinChiTiet, {
        // iOS Properties
        dismissButtonStyle: 'close',
        preferredBarTintColor: configs.Colors.agree,
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        preferredBarTintColor: configs.Colors.agree,
        secondaryToolbarColor: 'black',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,

        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right'
        },
      });
    }
    else Linking.openURL(item.thongTinChiTiet);
  };

  const renderItem2 = ({ item, index }) => {
    return (
      <View key={String(index)} style={styles.viewBottom}>
        <View style={styles.viewLeftTop}>
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.titleText}>
              {item.tenThuoc}
            </Text>
            {soLuongThuoc.map((item2, index2) =>
              renderItem3(item2, index2, index),
            )}
          </View>
          <Text style={{ fontStyle: 'italic' }}>
            ({item.hoatChatChinh})
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {huongDanSuDung.map((item1, index1) =>
              renderItem31(item1, index1, index),
            )}
          </View>
        </View>
        {/* <TouchableOpacity
          onPress={xemChiTiet(item)}
          style={{
            backgroundColor: "white",
            marginTop: 5,
            borderRadius: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: 'flex-end',
            width: 80,
            borderWidth: 3,
            borderColor: configs.Colors.primary
          }}
        >
          <Text style={{ fontWeight: "600" }}>Chi tiết</Text>
        </TouchableOpacity> */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        }}>
          <TouchableOpacity
            style={[{
              // backgroundColor: configs.Colors.agree,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              paddingHorizontal: 8,
            }]}
            onPress={xemChiTiet(item)}
          >
            {item.duyet == 'Duyệt' ?
              <Text style={{
                fontSize: 16,
                color: '#fff',
                fontWeight: '500',
                paddingVertical: 8,
              }}>{item.nhaCungCap}</Text>
              :
              <Text style={{
                fontSize: 16,
                color: '#f00',
                fontWeight: 'normal',
                paddingVertical: 8
              }}>{item.duyet}</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[{
              backgroundColor: configs.Colors.agree,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              paddingHorizontal: 8,
              shadowOffset: {
                width: 1,
                height: 3,
              },
              shadowOpacity: 0.5,
              shadowRadius: 1.8,
            }]}
            onPress={xemChiTiet(item)}
          >
            <Text style={{
              fontSize: 16,
              color: '#fff',
              fontWeight: 'normal',
              paddingVertical: 8
            }}>{`Chi tiết`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderItem31 = (item, index, index1) => {
    return (
      <View>
        <Text>
          {index1 == index ? item : null}
        </Text>
      </View>
    );
  };
  const renderItem3 = (item, index, index1) => {
    return (
      <>
        {index1 == index ? <Text>{item}</Text> : null}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={configs.Colors.blue} />
        </View>
      ) :
        <>
          {!!donThuoc && donThuoc.length > 0 ?
            <FlatList
              data={donThuoc}
              keyExtractor={(item, index) => `${item.id.toString()}-${index.toString()}`}
              renderItem={renderItem2}
            />
            :
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{`Danh sách rỗng`}</Text>
            </View>
          }
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e2',
    paddingTop: 32,
    paddingHorizontal: 8
  },
  viewTop: {
    flexDirection: 'row',
    alignSelf: "flex-start",
    width: '100%',
    alignItems: 'flex-start',
    borderColor: Colors.black,
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: Colors.grey,
  },
  viewLeftTop: {
    backgroundColor: "#32aed8",
    borderColor: Colors.white,
  },
  viewLeftTop1: {
    height: 2 * AppDimensions.heightButton,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    paddingHorizontal: 5,
  },
  txtTop: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.white,
  },
  txtTime: {
    fontSize: 14,
    textAlign: 'center',
  },
  txtName: {
    fontSize: 14,
    textAlign: 'center',
  },
  viewCenterTop: {
    paddingHorizontal: 3,
    height: AppDimensions.heightButton,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderColor: Colors.black,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  viewRightTop: {
    height: AppDimensions.heightButton,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewChanDoan: {
    width: '94%',
    alignSelf: 'center',
  },
  txtChanDoan: {
    marginTop: 15,
    marginBottom: 5,
  },
  viewItemChanDoan: {
    paddingTop: 5,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  itemChandoan: {
    height: AppDimensions.height30,
    backgroundColor: Colors.white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  txtItemChanDoan: {
    maxWidth: '100%',
  },
  viewTrieuChung: {
    width: '94%',
    alignSelf: 'center',
    marginTop: 15,
  },
  viewBottom: {
    // flex: 1,
    // flexDirection: 'row',
    borderColor: Colors.black,
    backgroundColor: "#32aed8",
    // paddingRight: 10,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8
  },
  vien: {
    borderRadius: 30,
    width: '200%',
    backgroundColor: '#269cc4',
    width: 80,
    alignItems: 'flex-start',
    padding: 5,
    overlayColor: "#8397af",
    color: 'red',

  },
  txtTrieuChung: {
    fontSize: 14,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "bold"
  },
  titleText1: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 20,
  },
});