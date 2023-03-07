import React, { useEffect, useRef, useState, memo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TextInput, Alert, Platform, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import * as configs from '../../../configs';
import Icon from 'react-native-vector-icons/FontAwesome';
import common from '../../../common/common';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { Button } from '../../../components/index';

const CanLamSang = ({ phienKhamRef, onSetBadge }) => {
  console.log('render-CanLamSang')

  const userInfo = useSelector((state) => state.authReducer.userInfo);

  const timeoutChange = useRef(null)

  const [canLamSang, setCanLamSang] = useState([]);
  const [modalMucDo, setModalMucDo] = useState({
    isVisible: false,
    moTa: '',
    index: 0,
  })

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
            let dsCanLamSang = [];
            if (phienKham.canLamSang) {
              for (let i = 0; i < phienKham.canLamSang.length; i++) {
                const item = phienKham.canLamSang[i];
                const [chiSoData] = await Promise.all([item.chiSo.get()])
                dsCanLamSang.push({
                  ...item,
                  chiSoData: chiSoData.data(),
                });
              }
            }
            dsCanLamSang.sort((a, b) => a.chiSoData.maChiSo > b.chiSoData.maChiSo ? 1
              : a.chiSoData.maChiSo == b.chiSoData.maChiSo ?
                (!b.thoiGian || new Date(a.thoiGian).getTime() > new Date(b.thoiGian).getTime()) ? 1 : -1 : -1)

            setCanLamSang(dsCanLamSang);
            setLoading(false)
            if (timeoutChange.current) {
              clearTimeout(timeoutChange.current)
            }
            timeoutChange.current = setTimeout(() => {
              if (onSetBadge) {
                onSetBadge('canLamSang', dsCanLamSang.length)
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

  const preUpdateMucDo = (value, index, name) => {
    setModalMucDo(prev => { return { ...prev, [name]: !!value ? value : '' } })
  }

  const updateMucDo = async () => {
    let dsCanLamSang = [...canLamSang];
    dsCanLamSang[modalMucDo.index].giaTri = modalMucDo.giaTri;
    dsCanLamSang[modalMucDo.index].nguoiDanhGia = userInfo.nhaCungCap?.tenNhaCungCap;
    // dsCanLamSang[modalMucDo.index].nguoiNhap = readyProviderRef.provider_ref;
    dsCanLamSang[modalMucDo.index].nguoiNhap = { "tenHienThi": userInfo.nhaCungCap?.tenNhaCungCap };
    dsCanLamSang[modalMucDo.index].thoiGian = new Date().toString();
    const newArr = dsCanLamSang.map(e => {
      let f = { ...e }
      delete f.chiSoData;
      return f
    })
    phienKhamRef.update({ canLamSang: newArr });
    setModalMucDo(prev => { return { ...prev, isVisible: false } })
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={configs.Colors.blue} />
          </View>
        ) :
          <>
            {!!canLamSang && canLamSang.length > 0 ?
              <FlatList
                data={canLamSang}
                keyExtractor={(item, index) => `${index.toString()}`}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity key={(index)}
                      style={{
                        marginVertical: 8,
                        backgroundColor: '#0f02',
                        padding: 8,
                        borderRadius: 8,
                        justifyContent: 'center'
                      }}
                      onPress={() => {
                        setModalMucDo(prev => {
                          return {
                            ...prev,
                            isVisible: true,
                            giaTri: item.giaTri,
                            tenThongDung: item.chiSoData.tenThongDung,
                            unit: item.chiSoData.unit,
                            index: index,
                          }
                        })
                      }}>
                      <View style={[common.flexRowSpaceBetween, { padding: 8 }]}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                          <View style={[common.flexRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                            <Text style={styles.labelText}>{item.chiSoData.tenThongDung}</Text>
                            {!!item.thoiGian &&
                              <Text style={[styles.txtTime, { paddingVertical: 4 }]}>
                                {moment(item.thoiGian).format('DD/MM/YY HH:mm')}
                              </Text>
                            }
                          </View>
                          {!!item.giaTri &&
                            <View style={[common.flexRow, { alignItems: 'center', justifyContent: 'flex-end' }]}>
                              <Text style={{
                                color: '#3c82fc',
                                fontSize: 16,
                                textAlign: 'right',
                                fontWeight: 'bold',
                                // width: '90%'
                                flex: 1
                              }}>
                                {!!item.giaTri ? item.giaTri : ''}
                              </Text>
                              <Text style={[styles.labelText, { fontSize: 12, fontStyle: 'italic', color: '#32AED8' }]}>
                                {`${!!item.chiSoData.unit ? ` (${item.chiSoData.unit})` : ''}`}
                              </Text>
                            </View>
                          }
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                }}
              />
              :
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{`Không có dữ liệu`}</Text>
              </View>
            }
          </>
        }
        <Modal
          isVisible={modalMucDo.isVisible}
          onSwipeComplete={() => setModalMucDo(prev => { return { ...prev, isVisible: false } })}
          swipeDirection={['up', 'left', 'right', 'down']}
          style={styles.bottomModal}
          propagateSwipe
          hasBackdrop
          onBackdropPress={() => { setModalMucDo(prev => { return { ...prev, isVisible: false } }) }}
        >
          {!!modalMucDo.isVisible &&
            <View style={{
              paddingHorizontal: 5,
              backgroundColor: '#fff',
              paddingHorizontal: 24,
              paddingVertical: 12,
              justifyContent: 'center',
              // alignItems: 'center',
              borderRadius: 4,
              borderColor: 'rgba(0, 0, 0, 0.1)',
            }}>
              <View style={[common.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                <Text style={[styles.labelText, { color: '#000' }]}>{modalMucDo.tenThongDung}</Text>
                <Text style={[styles.labelText, { color: '#000', fontSize: 14, fontStyle: 'italic', paddingRight: 16 }]}>{`${!!modalMucDo.unit ? ` (${modalMucDo.unit})` : ''}`}</Text>
              </View>
              <View style={[common.flexRow, {
                marginTop: 10,
                // flex: 1,
                justifyContent: 'center'
              }]}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Nhập mô tả cận lâm sàng..."
                  onChangeText={(value) => preUpdateMucDo(value, modalMucDo.index, 'giaTri')}
                  value={modalMucDo.giaTri}
                  returnKeyType='done'
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                <Button
                  title="Cập nhật"
                  styles={[
                    { backgroundColor: configs.Colors.dark, width: '90%' },
                  ]}
                  onPress={updateMucDo}
                />
              </View>
            </View>
          }
        </Modal>
      </View>
    </View>
  );
};

export default memo(CanLamSang);
