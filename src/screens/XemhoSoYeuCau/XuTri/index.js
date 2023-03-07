import React, { useEffect, useRef, useState, memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import styles from './styles';
import * as configs from '../../../configs';
import { Label } from '../../../components/index';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const XuTri = ({ phienKhamRef, onSetBadge }) => {
  console.log('render-XuTri')

  const [xuTri, setXuTri] = useState([]);
  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const timeoutChange = useRef(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    if (!!phienKhamRef) {
      try {
        const subscriber = phienKhamRef?.onSnapshot(async (snap) => {
          if (snap) {
            const phienkham = snap.data()
            let dsXuTri = [];
            if (phienkham.ds_xu_tri) {
              for (let i = 0; i < phienkham.ds_xu_tri.length; i++) {
                let item = phienkham.ds_xu_tri[i]
                if (item.info?.nguoiThucHien) {
                  const ncc = await item.info?.nguoiThucHien?.get();
                  item.nguoiThucHien = ncc.data();
                } else {
                  item.nguoiThucHien = null;
                }
                dsXuTri.push({ ...item });
              }
            }
            dsXuTri.sort((a, b) => a.uniqueKey > b.uniqueKey ? -1 : 1)
            setXuTri(dsXuTri);
            setLoading(false)
            if (timeoutChange.current) {
              clearTimeout(timeoutChange.current)
            }
            timeoutChange.current = setTimeout(() => {
              if (onSetBadge) {
                onSetBadge('xuTri', dsXuTri.length)
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
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
          <Label styles={{ fontSize: 18, fontWeight: "bold", paddingTop: 5, color: '#fff' }} title={item.info?.yLenh} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center" }}>
          <Icon name="id-card-alt" size={18}
            color="black" style={{ marginBottom: 8, marginRight: 8 }}
          />
          {!!item.nguoiThucHien?.nhaCungCap?.tenNhaCungCap ?

            <Label styles={{ fontSize: 16, fontWeight: "500", paddingTop: 5, }}
              title={item.nguoiThucHien?.nhaCungCap?.tenNhaCungCap} />
            :
            <Label styles={{ fontSize: 16, fontWeight: "200", paddingTop: 5, fontStyle: 'italic' }}
              title={``} />
          }
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center" }}>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            marginTop: 10,
          }}>
          <View style={{ borderRadius: 15, alignSelf: 'flex-end' }}></View>
          {
            item.info?.hoanThanh === '1' ?
              <View style={{ borderRadius: 15, alignSelf: 'flex-end' }} >
                <Text style={{ fontSize: 16, color: '#000', fontStyle: 'italic' }}>{moment(item.info?.thoiDiemThucHien).format('DD/MM/YYYY')}</Text>
              </View> :
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
                  onPress={() => updateHoanThanh(index)}
                >
                  <Text style={{
                    fontSize: 16,
                    color: '#fff',
                    fontWeight: 'normal',
                    paddingVertical: 7
                  }}>{`Xác nhận thực hiện`}</Text>
                </TouchableOpacity>
              </View>
          }
        </View>
      </View>
    );
  };

  async function updateHoanThanh(index) {
    const newArr = [...xuTri];
    newArr[index].info.hoanThanh = String('1');
    newArr[index].info.thoiDiemThucHien = new Date().toString();
    const ncc = await firestore()
      .collection('fl_content')
      .doc(userInfo.id);
    newArr[index].info.nguoiThucHien = ncc;
    phienKhamRef.update({ ds_xu_tri: newArr });
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={configs.Colors.blue} />
        </View>
      ) :
        <>
          {!!xuTri && xuTri.length > 0 ?
            <FlatList
              data={xuTri}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
            :
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{`Không có dữ liệu`}</Text>
            </View>
          }
        </>
      }
    </View>
  );
};

export default memo(XuTri);
