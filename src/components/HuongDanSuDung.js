import React, { memo, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking, FlatList, ActivityIndicator } from 'react-native';
import * as configs from "../configs";
import { AppDimensions, Colors } from "../configs";
import { Button, Label, ThongTinNCC } from './index';

const HuongDanSuDung = ({ phienKhamRef, onSetBadge }) => {

  const timeoutChange = useRef(null)

  const [dsChuaXuTri, setDSChuaXuTri] = useState([]);
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

            let dsChuaXuTri = [];
            if (phienKham.ds_xu_tri) {
              for (let i = 0; i < phienKham.ds_xu_tri?.length; i++) {
                let info = await phienKham.ds_xu_tri[i]?.info;
                if (!info.hoanThanh || info.hoanThanh == '0') {
                  dsChuaXuTri.push(info);
                }
              }
            }
            dsChuaXuTri.sort((a, b) => a.uniqueKey > b.uniqueKey ? -1 : 1)
            setDSChuaXuTri(dsChuaXuTri);
            setLoading(false)
            if (timeoutChange.current) {
              clearTimeout(timeoutChange.current)
            }
            timeoutChange.current = setTimeout(() => {
              if (onSetBadge) {
                onSetBadge('huongDanSuDung', dsChuaXuTri.length)
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

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, backgroundColor: configs.Colors.bgBlack, borderRadius: 8, padding: 8, marginBottom: 8 }}>
        <Label styles={{ fontSize: 18, fontWeight: "600", paddingTop: 5, color: '#fff' }} title={item.yLenh} />
      </View>
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
          {!!dsChuaXuTri && dsChuaXuTri.length > 0 ?
            <FlatList
              data={dsChuaXuTri}
              keyExtractor={(item, index) => `${index.toString()}`}
              renderItem={renderItem}
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
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
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
export default memo(HuongDanSuDung)